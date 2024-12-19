async function updateTask(taskId, url, updatedData) {
  const response = await fetch(`${url}/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedData)
  });
  if (!response.ok) {
    throw new Error("Ошибка" + response.statusText);
  }
}
export default updateTask;
