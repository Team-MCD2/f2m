import { DemandesListPage } from "@/components/admin/demandes-list-page";

export default function DemandesAccepteesPage() {
  return (
    <DemandesListPage
      title="Demandes acceptées"
      description="Dossiers acceptés, en formation ou diplômés."
      filterStatut={["accepte", "en_formation", "diplome"]}
    />
  );
}
