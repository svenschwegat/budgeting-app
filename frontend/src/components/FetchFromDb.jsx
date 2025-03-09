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