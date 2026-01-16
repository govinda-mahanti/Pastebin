export const createPaste = async (data: any) => {
  const res = await fetch("/api/paste", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Failed to create paste")
  return res.json()
}

export const getPaste = async (id: string) => {
  const res = await fetch(`/api/paste/${id}`)
  if (!res.ok) throw new Error("Paste not found")
  return res.json()
}
