import { auth } from "@/lib/auth";
import { getServicesForUser } from "@/lib/services-queries";

export default async function ServicesPage() {
  const session = await auth();
  if (!session?.user) {
    return (
      <div className="container py-8">
        Please sign in to view your services.
      </div>
    );
  }

  // Fetch services where user is client and developer
  const { asClient, asDeveloper } = await getServicesForUser(session.user.id);

  return (
    <div className="container space-y-8 py-8">
      <h1 className="mb-4 text-2xl font-bold">Your Services</h1>
      <div>
        <h2 className="mb-2 text-xl font-semibold">
          Services you are the client of
        </h2>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Developer</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {asClient.length === 0 && (
              <tr>
                <td colSpan={3} className="border px-2 py-1 text-center">
                  No services found.
                </td>
              </tr>
            )}
            {asClient.map((service) => (
              <tr key={service.id}>
                <td className="border px-2 py-1">{service.name}</td>
                <td className="border px-2 py-1">{service.developerName}</td>
                <td className="border px-2 py-1">{service.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="mb-2 text-xl font-semibold">
          Services you are the developer of
        </h2>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Client</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {asDeveloper.length === 0 && (
              <tr>
                <td colSpan={4} className="border px-2 py-1 text-center">
                  No services found.
                </td>
              </tr>
            )}
            {asDeveloper.map((service) => (
              <tr key={service.id}>
                <td className="border px-2 py-1">{service.name}</td>
                <td className="border px-2 py-1">{service.clientName}</td>
                <td className="border px-2 py-1">{service.status}</td>
                <td className="border px-2 py-1">
                  {service.status === "pending" ? (
                    <form action={`/api/service/validate`} method="POST">
                      <input
                        type="hidden"
                        name="serviceId"
                        value={service.id}
                      />
                      <button
                        type="submit"
                        className="rounded bg-green-500 px-2 py-1 text-white"
                      >
                        Validate
                      </button>
                    </form>
                  ) : (
                    <span className="text-gray-400">Validated</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
