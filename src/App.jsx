import { useState, useCallback, useEffect } from "react";
import { SearchBar } from "./components/SearchBar";
import { ClientTable } from "./components/ClientTable";
import { Pagination } from "./components/Pagination";
import { EditClientModal } from "./components/EditClientModal";
import { MdOutlineFileUpload } from "react-icons/md";

function App() {
  const [state, setState] = useState({
    clients: [],
    searchTerm: "",
    currentPage: 1,
    itemsPerPage: 10,
    editingClient: null,
  });

  const savedClients = localStorage.getItem("clients");
  useEffect(() => {
    if (savedClients) {
      setState((prev) => ({
        ...prev,
        clients: JSON.parse(savedClients),
      }));
    }
  }, [savedClients]);

  const handleFileUpload = (event) => {
    console.log("event", event);
    const file = event.target.files?.[0];
    console.log("file", file);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const newClients = JSON.parse(e.target?.result);

        const uniqueClients = [...state.clients];
        newClients.forEach((newClient) => {
          const existingIndex = uniqueClients.findIndex(
            (c) => c.email === newClient.email
          );

          console.log("existingIndex", existingIndex);
          if (existingIndex === -1) {
            uniqueClients.push(newClient);
          }
        });

        setState((prev) => ({
          ...prev,
          clients: uniqueClients,
          currentPage: 1,
        }));

        localStorage.setItem("clients", JSON.stringify(uniqueClients));
        event.target.value = null;
      } catch (error) {
        alert("Error parsing JSON file", error);
      }
    };
    reader.readAsText(file);
  };

  const handleSearch = useCallback((term) => {
    setState((prev) => ({ ...prev, searchTerm: term, currentPage: 1 }));
  }, []);

  const handleEdit = (client) => {
    setState((prev) => ({ ...prev, editingClient: client }));
  };

  const handleDelete = (client) => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.filter((c) => c.id !== client.id),
    }));

    localStorage.setItem(
      "clients",
      JSON.stringify(state.clients.filter((c) => c.id !== client.id))
    );
  };

  const handleSaveEdit = (updatedClient) => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.map((data) =>
        data.id === updatedClient.id ? updatedClient : data
      ),
      editingClient: null,
    }));

    localStorage.setItem(
      "clients",
      JSON.stringify(
        state.clients.map((data) =>
          data.id === updatedClient.id ? updatedClient : data
        )
      )
    );
  };

  const isEmailUnique = (email, currentId) => {
    return !state.clients.some(
      (client) => client.email === email && client.id !== currentId
    );
  };

  const filteredClients = state.clients.filter((client) => {
    const searchLower = state.searchTerm.toLowerCase();
    return (
      String(client.id).toLowerCase().includes(searchLower) ||
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredClients.length / state.itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Client Records Management
            </h1>
            <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
              <MdOutlineFileUpload className="h-5 w-5 mr-2" />
              Upload JSON
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="mb-6">
            <SearchBar searchTerm={state.searchTerm} onSearch={handleSearch} />
          </div>

          <ClientTable
            clients={filteredClients}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={state.currentPage}
            itemsPerPage={state.itemsPerPage}
          />

          <div className="mt-6">
            <Pagination
              currentPage={state.currentPage}
              totalPages={totalPages}
              onPageChange={(page) =>
                setState((prev) => ({ ...prev, currentPage: page }))
              }
            />
          </div>
        </div>
      </div>

      {state.editingClient && (
        <EditClientModal
          client={state.editingClient}
          onSave={handleSaveEdit}
          onClose={() => setState((prev) => ({ ...prev, editingClient: null }))}
          isEmailUnique={isEmailUnique}
        />
      )}
    </div>
  );
}

export default App;
