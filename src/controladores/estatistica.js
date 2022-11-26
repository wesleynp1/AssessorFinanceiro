export default estatistica = {
    getSaldoTotal:(contas)=>{
        let totalEmContas = 0;
        contas.map(c => {totalEmContas+=c.saldo});        
        return totalEmContas
    },

    getReceita:(transacoes,mesSelecionado)=>{
        let receitaTotal = 0;
        
        transacoes.forEach(t =>{if(t.valor>0)receitaTotal+=t.valor});
        
        return receitaTotal;
    },
    
    getDespesa:(transacoes,mesesSelecionado)=>{
        let despesaTotal = 0;
        
        transacoes.forEach(t =>{if(t.valor<0)despesaTotal+=t.valor});
        
        return despesaTotal;
    },
    
    getBalanco:(transacoes,mesesSelecionado)=>{
        let balanco = 0;
        
        transacoes.forEach(t =>{balanco+=t.valor});
        
        return balanco;
    }
}