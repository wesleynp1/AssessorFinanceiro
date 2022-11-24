import { resolvePlugin } from "@babel/core";
import conectorBancoDeDados from "./conectorBancoDeDados.js";

class controladorDados
{
    async getSaldo()
    {
        return await conectorBancoDeDados.getSaldo();
    }

    async getContas()
    {
        return await conectorBancoDeDados.getContas();
    }

    async getTransacoes()
    {
        return await conectorBancoDeDados.getTransacoes();
    }

    async excluirTransacao(id)
    {
        return await conectorBancoDeDados.excluirTransacao(id);
    }

    async inserirTransacao(t)
    {
        return await conectorBancoDeDados.inserirTransacao(t);
    }

    async atualizarTransacao(t)
    {
        return await conectorBancoDeDados.atualizarTransacao(t);
    }
}

export default controladorDados;