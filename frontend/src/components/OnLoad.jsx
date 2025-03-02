'use client'
export default async function OnLoad() {
    try {
        const backendUrl = "http://localhost:8000";
        var response = await fetch(backendUrl + '/parse/get-uploaded-items');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting uploaded items", error);
    }
}