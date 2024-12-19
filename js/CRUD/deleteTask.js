async function deleteTask(id, url) {
  const taskUrl = url + `/${id}`;
  const response = fetch(taskUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    },
    body: JSON.stringify(id)
  });
}

export default deleteTask;
