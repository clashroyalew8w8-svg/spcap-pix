import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Sua chave Mercado Pago
const ACCESS_TOKEN = "APP_USR-5763051175665115-102112-a7b6a29d4c87f1d1f254b999401581fa-2265178340";

app.get("/", (req, res) => {
  res.send("Servidor São Pedro CAP rodando 🚀");
});

app.post("/criar-pix", async (req, res) => {
  try {
    const valor = 2.00;
    const resposta = await axios.post(
      "https://api.mercadopago.com/v1/payments",
      {
        transaction_amount: valor,
        description: "Aposta São Pedro CAP",
        payment_method_id: "pix",
        payer: {
          email: "cliente@example.com",
          first_name: "Apostador",
          last_name: "SPCAP",
          identification: { type: "CPF", number: "12345678909" },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = resposta.data;
    res.json({
      id: data.id,
      status: data.status,
      qr_base64: data.point_of_interaction.transaction_data.qr_code_base64,
      qr_text: data.point_of_interaction.transaction_data.qr_code,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao criar PIX" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Rodando na porta ${PORT}`));

