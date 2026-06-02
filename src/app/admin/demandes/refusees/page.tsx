import { DemandesListPage } from "@/components/admin/demandes-list-page";

export default function DemandesRefuseesPage() {
  return (
    <DemandesListPage
      title="Demandes refusées"
      description="Candidatures refusées par l'équipe F2M."
      filterStatut="refuse"
    />
  );
}
