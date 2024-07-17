import { useState } from "react";
import { SafeAreaView ,View,Text, StyleSheet, FlatList} from "react-native"
import {Picker} from '@react-native-picker/picker';
import estatistica from "../../controladores/estatistica";
import { inteiroParaReal } from "../CampoDinheiro";
import { TextInput } from "react-native-gesture-handler";

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
    "Dezembro"
]

const PaginaEstatistica = ({transacoes,ano,selecionarAno})=>{

    const [mesSelecionado,setMesSelecionado] = useState(new Date().getMonth()); 
    const [anoSelecionado,setAnoSelecionado] = useState(ano);

    let pickersMes = []
    for(let i=0; i<mesesDoAno.length;i++){
        pickersMes.push(<Picker.Item label={mesesDoAno[i]} value={i} key={i}/>)
    }

    let transacoesDoMes = transacoes.filter(t => t.data.getMonth()==mesSelecionado);

    let receitaTotal = estatistica.getReceita(transacoesDoMes);
    let despesaTotal = estatistica.getDespesa(transacoesDoMes);
    
    let categorias =  estatistica.getValorPorCategorias(transacoesDoMes);
    
    let renderCategorias = (vc)=>{
        
        let eDespesa = vc.valor<0;
        let percentual = ((vc.valor/(eDespesa ? despesaTotal : receitaTotal))*100).toFixed(1) +"%";
            
        return (
            <View key={vc.categoria} style={[estilo.Quadro,{backgroundColor: eDespesa ? "#CC8A8A" : "#8ACC8A"}]}>
                <Text style={estilo.Categorias}>{vc.categoria}</Text>
                <Text style={estilo.Categorias}>Valor: {inteiroParaReal(vc.valor)}</Text>
                <Text style={estilo.Categorias}>({percentual})</Text> 
            </View>
        )              
    }

    return(
        <View style={{flex:1}}>
            
            <View style={{flex:1}}>
                <Text style={estilo.Titular}>ESTATÍSTICA</Text>
                <View style={{flexDirection:'row',justifyContent:'center'}}>
                    <Picker 
                            onValueChange={m =>{setMesSelecionado(m)}}
                            selectedValue={mesSelecionado}
                            style={{width:180,alignSelf:"center",backgroundColor:'black'}}> 
                        {pickersMes}
                    </Picker>

                    <TextInput 
                            value={anoSelecionado.toString()}
                            placeholder={anoSelecionado.toString()}
                            style={{width:64,textAlign:"center",backgroundColor:'#909000'}}
                            onChangeText={setAnoSelecionado}
                            onSubmitEditing={()=>selecionarAno(parseInt(anoSelecionado))}
                            />
                    </View>
            </View>

            <SafeAreaView style={{flex:5}}>
                <FlatList 
                    data={categorias}
                    renderItem={({item})=>renderCategorias(item)}/>
            </SafeAreaView>

        </View>
        )
}

const estilo = StyleSheet.create({
    Pagina:{
        padding: 16
    },

    Titular:{
        color:"black",
        textAlign:"center",
        fontSize:24
    },

    Texto:{
        fontSize: 36,
        color:"black",
        textAlign:'center'
    },

    Quadro: {  
        
        margin:5,
        borderColor:"black",
        borderStyle:"solid",
        borderWidth:2,
    },

    Categorias:{
        fontSize: 15,
        color:"black",
        textAlign:'center'
    }
});

export default PaginaEstatistica
