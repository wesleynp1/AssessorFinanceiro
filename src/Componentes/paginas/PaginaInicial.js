import {useState} from "react";
import { View,Text, Button,FlatList, SafeAreaView } from "react-native";
import {Picker} from '@react-native-picker/picker';

import Transacao from "../Transacao";
import { dateParaTexto } from "../CampoData.js";
import {inteiroParaReal} from "../CampoDinheiro"
import estatistica from "../../controladores/estatistica.js";


const PaginaInicial = ({irParaPaginaNovaTransacao, irParaPaginaEditarTransacao, transacoes, contas, excluirTransacao})=>{

    const [mesSelecionado,setMesSelecionado] = useState(new Date().getMonth());

    let transacoesDoMes = transacoes.filter(t => t.data.getMonth()==mesSelecionado);

    var d = new Date(); 
    const mesesDoAno = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    let pickersMes = []
    for(let i=0; i<mesesDoAno.length;i++){
        pickersMes.push(<Picker.Item    
                                     label={mesesDoAno[i]}
                                        value={i} 
                                        key={i}/>)
    }


    let receita = inteiroParaReal(estatistica.getReceita(transacoesDoMes,11));
    let despesa = inteiroParaReal(estatistica.getDespesa(transacoesDoMes,11));
    let balancoNegativo = (estatistica.getBalanco(transacoesDoMes,11)<0);
    let balanco = inteiroParaReal(estatistica.getBalanco(transacoesDoMes,11));
    if(balancoNegativo)balanco = balanco.replace("R$ ","R$ -");

    return(
        <View style={{flex:1,backgroundColor:"#AAAA00"}}>
            <View style={{flex:3}}>
                <Text style={{color:'black',textAlign:'center', fontSize:20}}>Assistente Financeiro</Text>
                <Text style={{color:'black',textAlign:'center'}}>HOJE: {dateParaTexto(new Date())}</Text>
                
                <Text style={{color:'black',textAlign:'center'}}>MÊS SELECIONADO: </Text>

                <Picker 
                    onValueChange={m =>{setMesSelecionado(m)}}
                    selectedValue={mesSelecionado}
                    style={{width:180,alignSelf:"center",backgroundColor:'#808000'}}>
                    {pickersMes}
                </Picker>
                
                <Text style={{color:'#007700',textAlign:'center'}}>RECEITA DO MÊS: {receita}</Text>
                <Text style={{color:'#770000',textAlign:'center'}}>DESPESA DO MÊS: {despesa}</Text>
                <Text style={{color:(balancoNegativo ? "#FF0000" : '#000077'),textAlign:'center'}}>BALANÇO DO MÊS: {balanco}</Text>

                <Text style={{color:'#000077',textAlign:'center'}}>NÚMERO DE TRANSAÇÕES: {transacoesDoMes.length}</Text>
                
                <Button onPress={()=>irParaPaginaNovaTransacao(false)} color="green" title={"registrar nova receita"}/> 
                <Button onPress={()=>irParaPaginaNovaTransacao(true)} color="red"  title={"registrar nova despesa"}/>                            
            </View>

            
                <SafeAreaView style={{flex:4, backgroundColor:"#221122",margin:4}}>
                        <FlatList
                            data={transacoesDoMes}
                            renderItem={({item})=>(<Transacao excluirTransacao={excluirTransacao} editarTransacao={irParaPaginaEditarTransacao} transacao={item}/>)}
                            />
                </SafeAreaView>
        </View>
    );
}

export default PaginaInicial