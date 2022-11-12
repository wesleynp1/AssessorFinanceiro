import { resolvePlugin } from "@babel/core";
import conectorBancoDeDados from "./conectorBancoDeDados.js";

class controladorDados
{
    async getSaldo()
    {
        return await conectorBancoDeDados.getSaldo();
    }

    async getTransacoes()
    {
        return await conectorBancoDeDados.getTransacoes();
    }

    async inserirTransacao(t)
    {
        return await conectorBancoDeDados.inserirTransacao(t);
    }
}

export default controladorDados;