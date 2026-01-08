"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EventForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    overview: "",
    image: "", // Por enquanto URL, depois podemos ajustar para upload
    venue: "",
    location: "",
    date: "",
    time: "",
    mode: "online", // Valor padrão conforme seu enum
    audience: "",
    organizer: "",
    agenda: "", // Vamos tratar como string separada por vírgula no input
    tags: "", // Vamos tratar como string separada por vírgula no input
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Convertendo strings separadas por vírgula em arrays para o Mongoose
      const payload = {
        ...formData,
        agenda: formData.agenda
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        tags: formData.tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Falha ao criar evento");
      }

      router.push("/"); // Redireciona para home após sucesso
      router.refresh(); // Atualiza os dados da página
    } catch (err) {
      setError("Erro ao salvar o evento. Verifique os dados.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto"
    >
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold leading-7 text-gray-900">
          Detalhes do Evento
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Preencha as informações obrigatórias.
        </p>
      </div>

      {error && (
        <div className="p-3 text-red-700 bg-red-100 rounded-md">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
        {/* Título */}
        <div className="sm:col-span-2">
          <label htmlFor="title" className={labelClass}>
            Título do Evento
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Descrição Curta (Overview) */}
        <div className="sm:col-span-2">
          <label htmlFor="overview" className={labelClass}>
            Resumo (Overview)
          </label>
          <input
            type="text"
            name="overview"
            required
            maxLength={500}
            value={formData.overview}
            onChange={handleChange}
            className={inputClass}
            placeholder="Um resumo curto para os cards..."
          />
        </div>

        {/* Descrição Completa */}
        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClass}>
            Descrição Completa
          </label>
          <textarea
            name="description"
            rows={4}
            required
            maxLength={1000}
            value={formData.description}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Imagem (URL por enquanto) */}
        <div className="sm:col-span-2">
          <label htmlFor="image" className={labelClass}>
            URL da Imagem
          </label>
          <input
            type="url"
            name="image"
            required
            value={formData.image}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        {/* Data e Hora */}
        <div>
          <label htmlFor="date" className={labelClass}>
            Data
          </label>
          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="time" className={labelClass}>
            Horário
          </label>
          <input
            type="time"
            name="time"
            required
            value={formData.time}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Localização e Modo */}
        <div>
          <label htmlFor="mode" className={labelClass}>
            Modo
          </label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="online">Online</option>
            <option value="offline">Presencial</option>
            <option value="hybrid">Híbrido</option>
          </select>
        </div>

        <div>
          <label htmlFor="venue" className={labelClass}>
            Local (Venue)
          </label>
          <input
            type="text"
            name="venue"
            required
            value={formData.venue}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ex: Auditório Principal / Zoom"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="location" className={labelClass}>
            Endereço Completo
          </label>
          <input
            type="text"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Organizador e Público */}
        <div>
          <label htmlFor="organizer" className={labelClass}>
            Organizador
          </label>
          <input
            type="text"
            name="organizer"
            required
            value={formData.organizer}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="audience" className={labelClass}>
            Público Alvo
          </label>
          <input
            type="text"
            name="audience"
            required
            value={formData.audience}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Arrays: Agenda e Tags */}
        <div className="sm:col-span-2">
          <label htmlFor="agenda" className={labelClass}>
            Agenda (separar itens por vírgula)
          </label>
          <textarea
            name="agenda"
            rows={3}
            required
            value={formData.agenda}
            onChange={handleChange}
            className={inputClass}
            placeholder="Abertura, Palestra Principal, Networking..."
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="tags" className={labelClass}>
            Tags (separar por vírgula)
          </label>
          <input
            type="text"
            name="tags"
            required
            value={formData.tags}
            onChange={handleChange}
            className={inputClass}
            placeholder="Tech, React, Frontend..."
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? "Salvando..." : "Criar Evento"}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
