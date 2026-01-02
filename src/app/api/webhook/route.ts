import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/client";

/**
 * Webhook para receber dados processados do Make.com
 * 
 * O Make.com envia os dados do candidato após processamento pelos 8 agentes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createAdminSupabaseClient();

    // Validar API Key (opcional - para segurança)
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== process.env.WEBHOOK_API_KEY && process.env.WEBHOOK_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Dados esperados do Make.com
    const {
      // Identificação do tenant
      tenant_id,
      whatsapp_instance_id,
      
      // Dados do candidato
      identifier, // phone ou email
      source_channel, // 'whatsapp' ou 'email'
      
      // Dados extraídos
      name,
      email,
      phone,
      city,
      state,
      
      // Currículo
      resume_url,
      resume_text,
      resume_json,
      
      // Resultados dos agentes
      sherlock_result,
      watson_result,
      laszlo_result,
      adam_grant_result,
      deming_result,
      drucker_result,
      carnegie_result,
      
      // Decisão final
      final_decision,
      final_score,
      recommended_department,
      
      // Status
      response_sent,
      response_channel,
    } = body;

    // Se não tem tenant_id, buscar pelo whatsapp_instance_id
    let finalTenantId = tenant_id;
    if (!finalTenantId && whatsapp_instance_id) {
      const { data: tenant } = await supabase
        .from("tenants")
        .select("id")
        .eq("whatsapp_instance_id", whatsapp_instance_id)
        .single();
      
      if (tenant) {
        finalTenantId = tenant.id;
      }
    }

    if (!finalTenantId) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 400 }
      );
    }

    // Verificar limite do plano
    const { data: tenantData } = await supabase
      .from("tenants")
      .select("plan_used, plan_limit")
      .eq("id", finalTenantId)
      .single();

    if (tenantData && tenantData.plan_used >= tenantData.plan_limit) {
      return NextResponse.json(
        { error: "Plan limit reached", plan_used: tenantData.plan_used, plan_limit: tenantData.plan_limit },
        { status: 429 }
      );
    }

    // Verificar duplicata (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: existingCandidate } = await supabase
      .from("candidates")
      .select("id")
      .eq("tenant_id", finalTenantId)
      .eq("identifier", identifier)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .single();

    if (existingCandidate) {
      return NextResponse.json(
        { 
          success: true, 
          duplicate: true, 
          existing_id: existingCandidate.id,
          message: "Candidate already exists (processed within last 30 days)" 
        },
        { status: 200 }
      );
    }

    // Inserir candidato
    const { data: newCandidate, error: insertError } = await supabase
      .from("candidates")
      .insert({
        tenant_id: finalTenantId,
        identifier,
        source_channel,
        name,
        email,
        phone,
        city,
        state,
        resume_url,
        resume_text,
        resume_json,
        sherlock_result,
        watson_result,
        laszlo_result,
        adam_grant_result,
        deming_result,
        drucker_result,
        carnegie_result,
        final_decision,
        final_score,
        recommended_department,
        response_sent: response_sent || false,
        response_channel,
        response_sent_at: response_sent ? new Date().toISOString() : null,
        status: "completed",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting candidate:", insertError);
      return NextResponse.json(
        { error: "Failed to insert candidate", details: insertError.message },
        { status: 500 }
      );
    }

    // Incrementar uso do plano
    await supabase
      .from("tenants")
      .update({ plan_used: (tenantData?.plan_used || 0) + 1 })
      .eq("id", finalTenantId);

    // Registrar log
    await supabase.from("activity_logs").insert({
      tenant_id: finalTenantId,
      candidate_id: newCandidate.id,
      action: "candidate_processed",
      details: {
        source_channel,
        final_decision,
        final_score,
      },
    });

    return NextResponse.json({
      success: true,
      candidate_id: newCandidate.id,
      final_decision,
      final_score,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET para verificar se o webhook está funcionando
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "TriagemAI Webhook is running",
    timestamp: new Date().toISOString(),
  });
}
