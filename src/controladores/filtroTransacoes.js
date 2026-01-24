import { dateParaTexto } from "../componentes/CampoData";
import { inteiroParaReal } from "../componentes/CampoDinheiro";

const filtrarTransacao = function (transacoes, texto){

    let tratarTexto = (t) => {
        return t.toLowerCase() //NÃO É CASE-SENSITIVE
            .replace("á", "a")//NÃO DIFERE ACENTO AGUDO 
            .replace("é", "e")
            .replace("í", "i")
            .replace("ó", "o")
            .replace("ú", "u")
            .replace("â", "a")//NÃO DIFERE ACENTO circunflexo
            .replace("ê", "e")
            .replace("ô", "o")
            ;
    }

    if (texto == "") return transacoes;

    let transacoesFiltradas = transacoes.filter((transacao) => {
        return (
            tratarTexto(transacao.categoria).includes(tratarTexto(texto)) ||
            dateParaTexto(transacao.data).includes(tratarTexto(texto)) ||
            tratarTexto(transacao.conta.toString()).includes(tratarTexto(texto)) ||
            inteiroParaReal(transacao.valor).includes(tratarTexto(texto))
        );
    });

    return transacoesFiltradas;
}

export default filtrarTransacao;