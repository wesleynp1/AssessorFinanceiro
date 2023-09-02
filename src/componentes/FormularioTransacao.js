import React,{useState} from "react";
import { Text,View,TextInput,StyleSheet, TouchableOpacity } from "react-native";
import {Picker} from '@react-native-picker/picker';

import CampoDinheiro from "./CampoDinheiro";
import {CampoData2} from "./CampoData";

const FormularioTransacao = ({transacaoInicial,aoSubmeter,eDespesa, contas})=>{
    const [categoria,setCategoria] = useState(transacaoInicial.categoria);
    const [data,setData] = useState(transacaoInicial.data);
    const [conta,setConta] = useState(transacaoInicial.conta);
    const [valor,setValor] = useState(Math.abs(transacaoInicial.valor));

    let corPadrão = (eDespesa ? "#AA0000" :'#009900');

    const verificarDados = (sePostivo,seNegativo)=>{
        let categoriaOk = categoria!="";
        let valorOk = valor!=0;
        let dataOk = new Date(data)!=undefined;

        if (categoriaOk && valorOk && dataOk){
            sePostivo();
        }else{
            seNegativo();
        }
    }

    const aoPressionarRegistrar = ()=>{
        let sePostivo = ()=> {aoSubmeter({
            categoria:categoria,
            data: new Date(data), 
            conta: conta,
            valor: parseInt((eDespesa ? "-" :'')+valor)
        })}

        let seNegativo = ()=> {alert("PREENCHE DIREITO ESTA MERDA!!!")};
        
        
        verificarDados(sePostivo,seNegativo)
        
    };

    const estilo= StyleSheet.create({
        rotulos:{
            fontSize: 12,
            color:corPadrão,
        },
        campos:{
            fontSize: 12,
            color:"black",
            textAlign:"center",
            borderColor:corPadrão,
            borderStyle:"solid",
            borderWidth:2,
            margin:10,
            padding: 2},

        botaoRegistrar:{
            backgroundColor:corPadrão,
            height:32,
            justifyContent:"center",
            alignItems:"center",
            margin:10}
    })

    
        let pickersContas = []
        for(let i=0; i<contas.length;i++)
        {
            pickersContas.push(<Picker.Item style={{backgroundColor:corPadrão,color:"black",textAlign:"center"}} 
                                            label={contas[i]} 
                                            value={contas[i]} 
                                            key={i}/>)
        }

    return(
    <View>

        <View style={estilo.campos}>
            <Text style={estilo.rotulos}>conta</Text>
            <Picker dropdownIconColor={corPadrão}
                    selectedValue={conta}
                    onValueChange={c =>{setConta(c)}}>            
                {pickersContas}            
            </Picker>
        </View>

        <TextInput  style={estilo.campos}
                    placeholderTextColor="gray"
                    value={categoria}
                    placeholder="Categoria"
                    onChangeText={setCategoria}
                    />

        <CampoDinheiro
                    estilo={estilo.campos}
                    valorInicial={valor}
                    aoMudarTexto={setValor}
                    />

        <CampoData2 estilo={estilo.campos}
                    aoMudarTexto={setData}
                    valorInicial={data}                    
                   />
        
        <TouchableOpacity style={estilo.botaoRegistrar} onPress={aoPressionarRegistrar}>
            <Text>REGISTRAR</Text>
        </TouchableOpacity>

    </View>)   
}

export default FormularioTransacao;
