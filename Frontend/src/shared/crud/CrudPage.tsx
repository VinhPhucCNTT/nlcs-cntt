import { useState } from "react";
import { CrudFormModal } from "./CrudFormModal.tsx";
import { CrudTable } from "./CrudTable.tsx";
import type { CrudConfig } from "./types.ts";
import { CrudToolbar } from "./CrudToolbar.tsx";

export function CrudPage<T extends { id: string }>({ config }: { config: CrudConfig<T> }) {
    const [search, setSearch] = useState("");

    return (
        <>
            <CrudToolbar
                config={config}
                onCreate={() => {/* open modal */ }}
                onSearch={setSearch}
            />

            <CrudTable config={config} search={search} />
            <CrudFormModal config={config} />
        </>
    );
}
