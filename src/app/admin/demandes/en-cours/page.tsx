import { DemandesListPage } from "@/components/admin/demandes-list-page";

export default function DemandesEnCoursPage() {
  return (
    <DemandesListPage
      title="Demandes en cours"
      description="Candidatures en attente de validation — accepter ou refuser."
      filterStatut="demande"
      showActions
    />
  );
}
