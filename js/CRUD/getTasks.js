async function getTasks(url) {
  const promise = await fetch(url);
  const data = await promise.json();
  return data;
}
export default getTasks;
