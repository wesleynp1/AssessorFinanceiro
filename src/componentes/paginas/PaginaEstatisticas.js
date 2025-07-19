import { useState } from "react";
import { SafeAreaView ,View,Text, StyleSheet, FlatList} from "react-native"
import {Picker} from '@react-native-picker/picker';
import estatistica from "../../controladores/estatistica";

import { TextInput } from "react-native-gesture-handler";

import {SeletorMesAno}  from "../SeletorMesAno.js";
import { inteiroParaReal } from "../CampoDinheiro";

const mesesDoAno = [
    "Janeiro", 
    "Fevereiro", 
    "Março", 
    "Abril", 
    "Maio", 
    "Junho", 
    "Julho", 
    "Agosto", 
    "Setembro", 
    "Outubro", 
    "Novembro", 
    "Dezembro",
    "ANUAL"
]

let eDespesa = true;

const PaginaEstatistica = ({transacoes,ano,selecionarAno})=>{

    const [mesSelecionado,setMesSelecionado] = useState(new Date().getMonth());
    const [anoSelecionado,setAnoSelecionado] = useState(ano);

    let pickersMes = []
    for(let i=0; i<mesesDoAno.length;i++){
        pickersMes.push(<Picker.Item label={mesesDoAno[i]} value={i} key={i}/>)
    }

    if(mesSelecionado!=13){//SE NÃO FOR O ANUAL
        transacoes = transacoes.filter(t => t.data.getMonth()==mesSelecionado);
    }

    let receitaTotal = estatistica.getReceita(transacoes);
    let despesaTotal = estatistica.getDespesa(transacoes);
    
    let categorias =  estatistica.getValorPorCategorias(transacoes);
    
    const renderCategorias = (vc)=>{
        
        let eDespesa = vc.valor<0;
        let percentual = ((vc.valor/(eDespesa ? despesaTotal : receitaTotal))*100).toFixed(1) +"%";
            
        return (
            <View key={vc.categoria} style={[estilo.Quadro,{backgroundColor: eDespesa ? "#420505ff" : "#064e06ff"}]}>
                <Text style={estilo.Categorias}>{vc.categoria}</Text>
                <Text style={[estilo.Categorias,{textAlign:'left'}]}>{inteiroParaReal(vc.valor)}</Text>
                <Text style={estilo.Categorias}>{percentual}</Text>
            </View>
        )              
    }

    const renderCabeçalhoCategoria = ()=>{
        return(
            <View style={estilo.Quadro}>
                <Text style={estilo.Categorias}>Categoria</Text>
                <Text style={estilo.Categorias}>Valor</Text>
                <Text style={estilo.Categorias}>Percentual</Text>
            </View>
        )
    }

    let receitaLiquida = estatistica.getReceitaLiquida(transacoes);
    let despesaLiquida = estatistica.getDespesaLiquida(transacoes);
    let balanco = receitaLiquida + despesaLiquida;

    return(
        <View style={estilo.Pagina}>
            
            <View>
                <Text style={estilo.Titulo}>ESTATÍSTICA</Text>
                <SeletorMesAno 
                    aoMudarMes={m =>{setMesSelecionado(m)}}
                    aoMudarAno={setAnoSelecionado}
                    aoConfirmarAno={()=>selecionarAno(parseInt(anoSelecionado))}
                    mesSelecionado={mesSelecionado} 
                    anoSelecionado={anoSelecionado}/>

                
                    <View style={{display:'flex', flexDirection: 'row'}}>
                        <View style={{flex:1}}>
                            <Text style={estilo.Texto}>Receita Líquida:</Text>
                            <Text style={estilo.Texto}>{inteiroParaReal(receitaLiquida)}</Text>
                        </View>

                        <View style={{flex:1}}>
                            <Text style={estilo.Texto}>Despesa Líquida:</Text>
                            <Text style={estilo.Texto}>{inteiroParaReal(despesaLiquida)}</Text>
                        </View>

                        <View style={{flex:1}}>
                            <Text style={estilo.Texto}>Balanco:</Text>
                            <Text style={estilo.Texto}>{inteiroParaReal(balanco)}</Text>
                        </View>                     
                    </View>                
            </View>

            <SafeAreaView style={{flex:1}}>
                <FlatList 
                    ListHeaderComponent={renderCabeçalhoCategoria()}
                    data={categorias}
                    renderItem={({item})=>renderCategorias(item)}/>                    
                    
            </SafeAreaView>

        </View>
        )
}

const estilo = StyleSheet.create({
    Pagina:{
        flex:1,
        backgroundColor: '#333232ff'
    },

    Titulo:{
        color:"white",
        textAlign:"center",
        fontSize:24
    },
    Texto:{
        fontSize: 12,
        color:"white",
        textAlign:'center'
    },
    Quadro: {
        flex:1,
        flexDirection: 'row',
        margin:2,
        borderColor:"black",
        borderStyle:"solid",
        borderWidth:2,
    },

    Categorias:{
        flex:1,
        fontSize: 20,
        color:"white",
        textAlign:'center'
    }
});

export default PaginaEstatistica
