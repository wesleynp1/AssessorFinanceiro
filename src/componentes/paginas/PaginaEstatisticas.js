import { useState } from "react";
import { SafeAreaView ,View,Text, StyleSheet} from "react-native"
import {Picker} from '@react-native-picker/picker';
import estatistica from "../../controladores/estatistica";
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
    "Dezembro"
]

const PaginaEstatistica = ({transacoes})=>{

    const [mesSelecionado,setMesSelecionado] = useState(new Date().getMonth()); 

    let pickersMes = []
    for(let i=0; i<mesesDoAno.length;i++){
        pickersMes.push(<Picker.Item label={mesesDoAno[i]} value={i} key={i}/>)
    }

    let transacoesDoMes = transacoes.filter(t => t.data.getMonth()==mesSelecionado);
    
    let Categorias = ()=>{
        return estatistica.getValorPorCategorias(transacoesDoMes)
        .sort((a,b)=> (a.valor<0 && b.valor<0) ? (a.valor>b.valor) : (a.valor<b.valor))
        .map( vc =>{
            return (
                <View key={vc.categoria} style={[estilo.Quadro,{backgroundColor: vc.valor<0 ? "#CC8A8A" : "#8ACC8A"}]}>
                    <Text style={estilo.Categorias}>{vc.categoria}</Text>
                    <Text style={estilo.Categorias}>Valor: {inteiroParaReal(vc.valor)}</Text>
                </View>
            )
        });
    }

    return(
        <SafeAreaView>
            <Text style={estilo.Titular}>ESTATÍSTICA</Text>

            <Picker 
                    onValueChange={m =>{setMesSelecionado(m)}}
                    selectedValue={mesSelecionado}
                    style={{width:180,alignSelf:"center",backgroundColor:'black'}}> 
                {pickersMes}
            </Picker>
            
            {Categorias()}

        </SafeAreaView>
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
        fontSize: 15,
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
