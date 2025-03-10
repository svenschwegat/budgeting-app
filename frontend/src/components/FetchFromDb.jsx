export default async function fetchFromDb(sqlStatement){
    const backendUrl = "http://localhost:8000";
    try {
        const response = await fetch(backendUrl + '/fetch-from-db', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sqlStatement: sqlStatement })
        });
        const data = await response.json();
        console.log('fetch from DB', data);
        return data;
    } catch (error) {
        console.error("Error getting data from DB", error);
        return null;
    }
};

export async function getCategories(){
  const sqlStatement = 'SELECT id, sub_category AS textValue, sub_category AS label FROM categories';
  const data = await fetchFromDb(sqlStatement);
  return data;
}