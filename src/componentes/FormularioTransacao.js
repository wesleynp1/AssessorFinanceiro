import React,{useState, useRef} from "react";
import { Text,View,TextInput,StyleSheet, TouchableOpacity} from "react-native";
import {Picker} from '@react-native-picker/picker';

import CampoDinheiro from "./CampoDinheiro";
import {CampoData2} from "./CampoData";
import ContasPicker from "./ContasPicker";

const FormularioTransacao = ({transacaoInicial,aoSubmeter,eDespesa, contas})=>{
    const [categoria,setCategoria] = useState(transacaoInicial.categoria);
    const [data,setData] = useState(transacaoInicial.data);
    const [conta,setConta] = useState(transacaoInicial.conta);
    const [valor,setValor] = useState(transacaoInicial.valor);


    const verificarDados = ()=>{
        let categoriaOk = categoria!="";
        let valorOk = valor!=0;
        let dataOk = new Date(data)!=undefined;

        if (categoriaOk && valorOk && dataOk){
            aoSubmeter({
                categoria:categoria.trim(),
                data: new Date(data),
                conta: conta,
                valor: parseInt(valor)
            });
        }else{
            throw "PREENCHE DIREITO ESTA MERDA!!!";
        }
    }

    const aoPressionarRegistrar = ()=>{
        try{
            verificarDados();
        }catch(msg){
            alert(msg);
        }
    };

    //ESTILO DO COMPONENTE
    const corPadrão = (eDespesa ? "#AA0000" :'#009900');
    const corFonte  = (eDespesa ? 'white' :'black');

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
            padding: 2
        },
        botaoRegistrar:{
            backgroundColor:corPadrão,
            height:32,
            justifyContent:"center",
            alignItems:"center",
            margin:10
        }       
    });    
    
    const refCampoDinheiro = useRef();
    
    return(
        <View>
            
            <ContasPicker  
                        contas={contas} 
                        contaSelecionada={conta}
                        corFonte={corFonte}  
                        corPadrao={corPadrão}
                        onValueChange={c => setConta(c)}/>

            <TextInput  
                        autoFocus={true}
                        style={estilo.campos}
                        placeholderTextColor="gray"
                        value={categoria}
                        placeholder="Categoria"
                        onChangeText={setCategoria}
                        onSubmitEditing={()=>refCampoDinheiro.current.focus()}
                        />

            <CampoDinheiro
                        estilo={estilo.campos}
                        valorInicial={valor}
                        aoMudarTexto={setValor}
                        negativo={eDespesa}
                        referencia={refCampoDinheiro}
                        />

            <CampoData2 estilo={estilo.campos}
                        valorInicial={data}
                        aoMudarTexto={setData}
                    />
            
            <TouchableOpacity style={estilo.botaoRegistrar} onPress={aoPressionarRegistrar}>
                <Text>REGISTRAR</Text>
            </TouchableOpacity>
        </View>
    );
}

export default FormularioTransacao;
