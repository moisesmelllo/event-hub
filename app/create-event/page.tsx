/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const EventForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Estado para o arquivo de imagem
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    overview: "",
    venue: "",
    location: "",
    date: "",
    time: "",
    mode: "online",
    audience: "",
    organizer: "",
    agenda: "", // Tratado como string no input, array no envio
    tags: "", // Tratado como string no input, array no envio
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!selectedImage) {
      setError("A imagem de capa é obrigatória.");
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();

      // --- AJUSTE CRÍTICO PARA O SEU BACKEND ---
      // Seu route.ts espera: formData.get("image")
      data.set("image", selectedImage);
      // ------------------------------------------

      data.set("title", formData.title);
      data.set("description", formData.description);
      data.set("overview", formData.overview);
      data.set("venue", formData.venue);
      data.set("location", formData.location);
      data.set("date", formData.date);
      data.set("time", formData.time);
      data.set("mode", formData.mode);
      data.set("audience", formData.audience);
      data.set("organizer", formData.organizer);

      // Tratamento de Arrays
      const agendaArray = formData.agenda
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const tagsArray = formData.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (agendaArray.length === 0)
        throw new Error("A agenda precisa ter pelo menos um item.");
      if (tagsArray.length === 0)
        throw new Error("As tags precisam ter pelo menos um item.");

      // Adiciona itens repetindo a chave (padrão FormData para arrays)
      agendaArray.forEach((item) => data.append("agenda", item));
      tagsArray.forEach((item) => data.append("tags", item));

      const response = await fetch("/api/events", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        // Lê a resposta como texto para capturar erros HTML/Server Crash
        const errorText = await response.text();
        console.error("Erro CRU do servidor:", errorText);

        // Tenta extrair mensagem se for JSON, senão usa texto genérico
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || "Falha ao criar evento");
        } catch {
          throw new Error(
            `Erro no servidor (não JSON): ${response.status} ${response.statusText}`
          );
        }
      }

      // Limpeza de memória do preview
      if (imagePreview) URL.revokeObjectURL(imagePreview);

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao enviar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Estilos (Texto preto e fundo branco garantidos)
  const inputClass =
    "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 bg-white placeholder:text-gray-400";
  const labelClass = "block text-sm font-medium text-gray-900";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto border border-gray-200"
    >
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold leading-7 text-gray-900">
          Detalhes do Evento
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Preencha as informações para criar um novo evento.
        </p>
      </div>

      {error && (
        <div className="p-3 text-red-700 bg-red-100 border border-red-200 rounded-md text-sm">
          {error}
        </div>
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
            maxLength={100}
            value={formData.title}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Upload de Imagem */}
        <div className="sm:col-span-2">
          <label htmlFor="image" className={labelClass}>
            Imagem de Capa (Upload)
          </label>
          <input
            type="file"
            name="image" // Nome 'image' no input também para consistência
            id="image"
            accept="image/*"
            required
            onChange={handleImageChange}
            className={`mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100`}
          />
          {imagePreview && (
            <div className="mt-4 relative h-64 w-full sm:w-1/2 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Resumo */}
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
          />
        </div>

        {/* Descrição */}
        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClass}>
            Descrição Completa
          </label>
          <textarea
            name="description"
            rows={5}
            required
            maxLength={1000}
            value={formData.description}
            onChange={handleChange}
            className={inputClass}
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

        {/* Modo e Local */}
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
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
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
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="location" className={labelClass}>
            Endereço / Localização
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

        {/* Agenda e Tags */}
        <div className="sm:col-span-2">
          <label htmlFor="agenda" className={labelClass}>
            Agenda (separar por vírgula)
          </label>
          <textarea
            name="agenda"
            rows={3}
            required
            value={formData.agenda}
            onChange={handleChange}
            className={inputClass}
            placeholder="Item 1, Item 2..."
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
            placeholder="tag1, tag2..."
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6 border-t border-gray-200 pt-6">
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
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-blue-300"
        >
          {isSubmitting ? "Criando..." : "Criar Evento"}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
