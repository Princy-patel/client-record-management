import { MdEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";

export function ClientTable({
  clients,
  onEdit,
  onDelete,
  currentPage,
  itemsPerPage,
}) {
  console.log("clientssssss", clients);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paignatedClients = clients.slice(startIndex, startIndex + itemsPerPage);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paignatedClients.map((client) => (
            <tr key={client.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {client.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {client.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {client.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(client)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  <MdEdit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(client)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FaRegTrashAlt className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
