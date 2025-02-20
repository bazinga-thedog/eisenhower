import { useEffect, useState } from "react";

interface ApiResponse {
  id: BigInteger;
  description: string;
}

export default function App() {
  const [data, setData] = useState<ApiResponse[]>([]);

  useEffect(() => {
    fetch("http://localhost:3030/api/task")
      .then((response) => response.json())
      .then((data: ApiResponse[]) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">API Data</h1>
      <ul className="list-disc pl-5">
        {
        data.map((item, index) => (
          <li key={index}>{item.id} - {item.description}</li>
        ))}
      </ul>
    </div>
  );
}
