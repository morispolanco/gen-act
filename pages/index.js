import { useState } from 'react';

export default function Home() {
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('');
  const [concept, setConcept] = useState('');
  const [numActivities, setNumActivities] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateActivity = async () => {
    if (!subject || !level || !concept || !instructions || !numActivities) {
      alert('Por favor, completa todos los campos para generar la actividad.');
      return;
    }

    setIsLoading(true);

    const apiKey = process.env.NEXT_PUBLIC_TOGETHER_API_KEY;
    const models = ["togethercomputer/llama-2-70b-chat"];
    const basePrompt = `Diseña ${numActivities} actividad(es) didáctica(s) para ${subject} en el nivel ${level}, enfocada(s) en reforzar el concepto de ${concept}.`;

    try {
      const response = await fetch('https://api.together.xyz/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: models[0],
          prompt: `${basePrompt}\n\nInstrucciones adicionales: ${instructions}\n\nActividad(es) didáctica(s) generada(s):\n`,
          max_tokens: 2048,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta de la API');
      }

      const data = await response.json();
      const generatedActivity = data.choices[0].text.trim();
      setGeneratedContent(generatedActivity);
    } catch (error) {
      console.error('Error:', error);
      setGeneratedContent('Error: No se pudo generar la actividad. Verifica tu API Key de Together AI.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
      <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>Generador de Actividades Didácticas</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="subject">Asignatura:</label>
        <input 
          type="text" 
          id="subject" 
          placeholder="Ej: Matemáticas, Ciencias, etc." 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
        />

        <label htmlFor="level">Nivel o Grado:</label>
        <input 
          type="text" 
          id="level" 
          placeholder="Ej: Primaria, Secundaria, etc." 
          value={level} 
          onChange={(e) => setLevel(e.target.value)} 
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
        />

        <label htmlFor="concept">Concepto a Reforzar:</label>
        <input 
          type="text" 
          id="concept" 
          placeholder="Ej: Fracciones, Ecosistemas, etc." 
          value={concept} 
          onChange={(e) => setConcept(e.target.value)} 
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
        />

        <label htmlFor="numActivities">Número de Actividades (1 a 5):</label>
        <input 
          type="number" 
          id="numActivities" 
          min="1" 
          max="5" 
          value={numActivities} 
          onChange={(e) => setNumActivities(e.target.value)} 
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
        />

        <label htmlFor="instructions">Instrucciones adicionales:</label>
        <textarea 
          id="instructions" 
          rows="4" 
          placeholder="Ej: Usa materiales manipulativos para la actividad" 
          value={instructions} 
          onChange={(e) => setInstructions(e.target.value)} 
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
        />

        <button 
          onClick={generateActivity} 
          style={{ backgroundColor: '#3498db', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isLoading ? 'Generando...' : 'Generar Actividad'}
        </button>
      </div>

      <div style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', padding: '15px', borderRadius: '4px' }}>
        {generatedContent && (
          <>
            <h3>Actividad(es) Generada(s):</h3>
            <div style={{ whiteSpace: 'pre-wrap' }}>{generatedContent}</div>
          </>
        )}
      </div>
    </div>
  );
}
