import React, { useState } from "react";

interface Person {
    last_name: string;
    given_names: string;
    middle_name: string;
    birthdate: string;
    address: string;
  }

function ExtractNationalId() {
  const [image, setImage] = useState<File | null>(null);
  const [data, setData] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files ? e.target.files[0] : null);
  };

  

  const handleExtract = async () => {
    if (!image) return;
    const form = new FormData();
    form.append("file", image);
  
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/extract-id", {
        method: "POST",
        body: form,
      });
  
      if (!res.ok) {
        throw new Error('Failed to extract data');
      }
  
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("OCR failed:", err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Extract National ID</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        onClick={handleExtract}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Extracting..." : "Extract ID Info"}
      </button>

      {data && (
        <div className="mt-6 space-y-2">
          <div><strong>Last Name:</strong> {data.last_name}</div>
          <div><strong>Given Names:</strong> {data.given_names}</div>
          <div><strong>Middle Name:</strong> {data.middle_name}</div>
          <div><strong>Birthdate:</strong> {data.birthdate}</div>
          <div><strong>Address:</strong> {data.address}</div>
        </div>
      )}
    </div>
  );
}

export default ExtractNationalId;
