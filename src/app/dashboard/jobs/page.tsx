"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  Check,
  Users,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  department_id: string;
  description: string;
  requirements: string;
  requires_cnh: boolean;
  cnh_categories: string[];
  min_experience_years: number;
  is_active: boolean;
  current_candidates: number;
  created_at: string;
}

interface Department {
  id: string;
  name: string;
}

export default function JobsPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [saving, setSaving] = useState(false);
  const [tenantId, setTenantId] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    department_id: "",
    description: "",
    requirements: "",
    requires_cnh: false,
    cnh_categories: [] as string[],
    min_experience_years: 0,
    is_active: true,
  });

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: userData } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("auth_id", user?.id)
        .single();

      if (userData?.tenant_id) {
        setTenantId(userData.tenant_id);

        // Carregar vagas
        const { data: jobsData } = await supabase
          .from("jobs")
          .select("*")
          .eq("tenant_id", userData.tenant_id)
          .order("created_at", { ascending: false });

        setJobs(jobsData || []);

        // Carregar departamentos
        const { data: depsData } = await supabase
          .from("departments")
          .select("*")
          .eq("tenant_id", userData.tenant_id)
          .eq("is_active", true);

        setDepartments(depsData || []);
      }
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else if (name === "min_experience_years") {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCNHChange = (category: string) => {
    const categories = formData.cnh_categories.includes(category)
      ? formData.cnh_categories.filter((c) => c !== category)
      : [...formData.cnh_categories, category];
    setFormData({ ...formData, cnh_categories: categories });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      department_id: "",
      description: "",
      requirements: "",
      requires_cnh: false,
      cnh_categories: [],
      min_experience_years: 0,
      is_active: true,
    });
    setEditingJob(null);
    setShowForm(false);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department_id: job.department_id || "",
      description: job.description || "",
      requirements: job.requirements || "",
      requires_cnh: job.requires_cnh,
      cnh_categories: job.cnh_categories || [],
      min_experience_years: job.min_experience_years,
      is_active: job.is_active,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingJob) {
        // Atualizar
        await supabase
          .from("jobs")
          .update(formData)
          .eq("id", editingJob.id);
      } else {
        // Criar
        await supabase.from("jobs").insert({
          ...formData,
          tenant_id: tenantId,
        });
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta vaga?")) return;

    try {
      await supabase.from("jobs").delete().eq("id", id);
      await loadData();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  const toggleActive = async (job: Job) => {
    try {
      await supabase
        .from("jobs")
        .update({ is_active: !job.is_active })
        .eq("id", job.id);
      await loadData();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  const getDepartmentName = (id: string) => {
    return departments.find((d) => d.id === id)?.name || "-";
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vagas</h1>
          <p className="text-muted-foreground">
            Gerencie as vagas abertas na sua empresa
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Vaga
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{jobs.length}</p>
                <p className="text-sm text-muted-foreground">Total de Vagas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {jobs.filter((j) => j.is_active).length}
                </p>
                <p className="text-sm text-muted-foreground">Vagas Ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {jobs.reduce((acc, j) => acc + (j.current_candidates || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Candidatos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingJob ? "Editar Vaga" : "Nova Vaga"}</CardTitle>
            <CardDescription>
              Preencha os dados da vaga. Essas informações serão usadas pela IA
              para avaliar os candidatos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Vaga *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Motorista CNH-D"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department_id">Departamento</Label>
                  <select
                    id="department_id"
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Selecione...</option>
                    {departments.map((dep) => (
                      <option key={dep.id} value={dep.id}>
                        {dep.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva as responsabilidades da vaga..."
                  className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requisitos</Label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Liste os requisitos necessários..."
                  className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="min_experience_years">
                    Experiência Mínima (anos)
                  </Label>
                  <Input
                    id="min_experience_years"
                    name="min_experience_years"
                    type="number"
                    min="0"
                    value={formData.min_experience_years}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>CNH</Label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="requires_cnh"
                        checked={formData.requires_cnh}
                        onChange={handleChange}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Exige CNH</span>
                    </label>
                  </div>
                  {formData.requires_cnh && (
                    <div className="mt-2 flex gap-2">
                      {["A", "B", "C", "D", "E"].map((cat) => (
                        <label
                          key={cat}
                          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded border text-sm ${
                            formData.cnh_categories.includes(cat)
                              ? "bg-primary text-primary-foreground"
                              : "bg-background"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.cnh_categories.includes(cat)}
                            onChange={() => handleCNHChange(cat)}
                            className="sr-only"
                          />
                          {cat}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_active">Vaga ativa (recebendo candidatos)</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {jobs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vaga</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>CNH</TableHead>
                  <TableHead>Exp. Mínima</TableHead>
                  <TableHead>Candidatos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{job.title}</p>
                        {job.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {job.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getDepartmentName(job.department_id)}</TableCell>
                    <TableCell>
                      {job.requires_cnh ? (
                        <Badge variant="outline">
                          {job.cnh_categories?.join(", ") || "Qualquer"}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {job.min_experience_years > 0
                        ? `${job.min_experience_years} ano(s)`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{job.current_candidates || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={job.is_active ? "success" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleActive(job)}
                      >
                        {job.is_active ? "Ativa" : "Inativa"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(job)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(job.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Briefcase className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">Nenhuma vaga cadastrada</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Crie sua primeira vaga para começar a receber candidatos
              </p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Vaga
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
