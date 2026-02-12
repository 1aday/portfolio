export function getProjectImage(theme: string, genericPath: string): string {
  return genericPath.replace("/projects/", `/projects/${theme}/`);
}
