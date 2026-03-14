const form      = document.getElementById("predictionForm");
const submitBtn = document.getElementById("submitBtn");
const resultDiv = document.getElementById("result");
const errorDiv  = document.getElementById("error");
const predText  = document.getElementById("predictionText");
const predSub   = document.getElementById("predictionSub");
const resHeader = document.getElementById("resultHeader");
const errorText = document.getElementById("errorText");

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const glucose       = parseFloat(document.getElementById("glucose").value);
    const bloodpressure = parseFloat(document.getElementById("bloodpressure").value);
    const skinthickness = parseFloat(document.getElementById("skinthickness").value);
    const insulin       = parseFloat(document.getElementById("insulin").value);
    const bmi           = parseFloat(document.getElementById("bmi").value);
    const dpf           = parseFloat(document.getElementById("dpf").value);
    const age           = parseFloat(document.getElementById("age").value);

    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ Analyse en cours...";
    resultDiv.classList.add("hidden");
    errorDiv.classList.add("hidden");

    try {
        const response = await fetch("/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                features: [glucose, bloodpressure, skinthickness, insulin, bmi, dpf, age]
            })
        });

        const data = await response.json();

        if (data.success) {
            resultDiv.classList.remove("hidden");

            if (data.prediction === 1) {
                resultDiv.className = "result positive";
                resHeader.textContent = "⚠️ Résultat de l'Analyse";
                predText.textContent = "Risque de Diabète Détecté";
                predSub.textContent = "Le modèle prédit un résultat positif. Une consultation médicale est recommandée.";
            } else {
                resultDiv.className = "result negative";
                resHeader.textContent = "✅ Résultat de l'Analyse";
                predText.textContent = "Aucun Risque de Diabète Détecté";
                predSub.textContent = "Le modèle prédit un résultat négatif. Continuez à maintenir un mode de vie sain.";
            }
        } else {
            errorText.textContent = "Erreur serveur : " + data.error;
            errorDiv.classList.remove("hidden");
        }

    } catch (err) {
        errorText.textContent = "❌ Impossible de contacter le serveur. Vérifiez que Flask est actif.";
        errorDiv.classList.remove("hidden");
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "🔍 Lancer l'Analyse Prédictive";
});