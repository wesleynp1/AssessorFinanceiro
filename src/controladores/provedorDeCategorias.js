export default function getCategorias(transacoes){
    let rankingDeTransacoes = []

    for (let transacao of transacoes){
        let transacao_no_ranking = rankingDeTransacoes.find(
            item => item.categoria == transacao.categoria
        )

        if (transacao_no_ranking != undefined){
            transacao_no_ranking.contagem+=1
        }else{
            rankingDeTransacoes.push({categoria:transacao.categoria , contagem:1})
        }
    }

    return rankingDeTransacoes
            .sort((a,b) => b.contagem - a.contagem)
            .map(transacao => transacao.categoria)
}

/* TESTE
const mock_transacoes = [
    { categoria : "D" },
    { categoria : "D" },
    { categoria : "B" },
    { categoria : "B" },
    { categoria : "D" },
    { categoria : "B" },
    { categoria : "C" },
    { categoria : "A" },
    { categoria : "C" },
    { categoria : "A" },
    { categoria : "A" },
    { categoria : "B" },
    { categoria : "D" },
    { categoria : "D" },
]

console.log(getCategorias(mock_transacoes))
*/