const estatistica = {

    getSaldoTotal:(contas)=>{
        let totalEmContas = 0;
        contas.map(c => {totalEmContas+=c.saldo});        
        return totalEmContas
    },

    getReceita:(transacoes)=>{
        let receitaTotal = 0;
        
        transacoes.forEach(t =>{if(t.valor>0)receitaTotal+=t.valor});
        
        return receitaTotal;
    },
    
    getDespesa:(transacoes)=>{
        let despesaTotal = 0;
        
        transacoes.forEach(t =>{if(t.valor<0)despesaTotal+=t.valor});
        
        return despesaTotal;
    },
    
    getBalanco:(transacoes)=>{
        let balanco = 0;
        
        transacoes.forEach(t =>{balanco+=t.valor});
        
        return balanco;
    },

    getCategorias:(transacoes)=>{
        let categorias = transacoes.map(t => t.categoria);
        return categorias.filter((c, index)=>{return categorias.indexOf(c) == index;})
    },

    getValorPorCategorias:(transacoes)=>{
        let categorias = estatistica.getCategorias(transacoes);

        let valorPorCategoria = categorias.map(c =>{
            let valorDaCategoria = 0;
            transacoes.forEach(t => {if(t.categoria==c)valorDaCategoria+=t.valor })
            return {categoria: c,valor: valorDaCategoria}
        }).sort((a,b)=> (a.valor<0 && b.valor<0) ? (a.valor>b.valor) : (a.valor<b.valor));

        return valorPorCategoria;
    }

}

export default estatistica