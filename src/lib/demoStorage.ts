import { Curriculum } from "../types";

const ACCESS_KEY = "zegiju.t.accessEmail";
const CURRICULA_KEY = "zegiju.t.demoCurricula";

const isBrowser = typeof window !== "undefined";

export function getStoredAccessEmail() {
  if (!isBrowser) return "";
  return window.localStorage.getItem(ACCESS_KEY) ?? "";
}

export function setStoredAccessEmail(email: string) {
  if (!isBrowser) return;
  window.localStorage.setItem(ACCESS_KEY, email);
}

export function clearStoredAccessEmail() {
  if (!isBrowser) return;
  window.localStorage.removeItem(ACCESS_KEY);
}

export function getStoredDemoCurricula(): Curriculum[] {
  if (!isBrowser) return [];

  try {
    const raw = window.localStorage.getItem(CURRICULA_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Curriculum[];
  } catch {
    return [];
  }
}

export function saveStoredDemoCurricula(curricula: Curriculum[]) {
  if (!isBrowser) return;
  window.localStorage.setItem(CURRICULA_KEY, JSON.stringify(curricula));
}

export function upsertStoredDemoCurriculum(curriculum: Curriculum) {
  const curricula = getStoredDemoCurricula();
  const index = curricula.findIndex((item) => item.id === curriculum.id);

  if (index >= 0) {
    curricula[index] = curriculum;
  } else {
    curricula.unshift(curriculum);
  }

  saveStoredDemoCurricula(curricula);
}