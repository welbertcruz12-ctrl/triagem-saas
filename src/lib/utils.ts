import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatPhone(phone: string) {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function getDecisionColor(decision: string) {
  switch (decision?.toUpperCase()) {
    case "AVANCAR":
      return "badge-avancar";
    case "AVALIAR":
      return "badge-avaliar";
    case "DESCARTAR":
      return "badge-descartar";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getDecisionLabel(decision: string) {
  switch (decision?.toUpperCase()) {
    case "AVANCAR":
      return "Avançar";
    case "AVALIAR":
      return "Avaliar";
    case "DESCARTAR":
      return "Descartar";
    default:
      return decision;
  }
}

export function getChannelColor(channel: string) {
  switch (channel?.toLowerCase()) {
    case "whatsapp":
      return "badge-whatsapp";
    case "email":
      return "badge-email";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function calculatePercentage(used: number, limit: number) {
  if (limit === 0) return 0;
  return Math.round((used / limit) * 100);
}
