export interface BuildJobLinksParams {
  keyword: string;
  remote?: boolean;
}

export interface JobLink {
  portal: string;
  url: string;
}

export function buildJobLinks({ keyword, remote = false }: BuildJobLinksParams): JobLink[] {
  const q = encodeURIComponent(keyword.trim());

  const infojobsUrl = `https://www.infojobs.net/jobsearch/search-results/list.xhtml?keyword=${q}${
    remote ? "&teleworkingType=FULL" : ""
  }`;

  const indeedUrl = `https://es.indeed.com/jobs?q=${q}${remote ? "&l=Remoto" : ""}`;

  const tecnoempleoKeyword = remote ? `${keyword.trim()} AND teletrabajo` : keyword.trim();
  const tecnoempleoUrl = `https://www.tecnoempleo.com/busqueda-empleo.php?te=${encodeURIComponent(
    tecnoempleoKeyword
  )}`;

  const linkedinUrl = `https://www.linkedin.com/jobs/search/?keywords=${q}${
    remote ? "&f_WT=2" : ""
  }`;

  return [
    { portal: "InfoJobs", url: infojobsUrl },
    { portal: "Indeed", url: indeedUrl },
    { portal: "Tecnoempleo", url: tecnoempleoUrl },
    { portal: "LinkedIn", url: linkedinUrl },
  ];
}
