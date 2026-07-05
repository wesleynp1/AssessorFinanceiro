import React,{useState, useRef} from "react";
import { Text,View,TextInput,StyleSheet, TouchableOpacity} from "react-native";
import {Picker} from '@react-native-picker/picker';

import CampoDinheiro from "./CampoDinheiro";
import {CampoData2} from "./CampoData";
import ContasPicker from "./ContasPicker";

const FormularioTransacao = ({transacaoInicial,aoSubmeter,eDespesa, contas, categorias: categoriasJaUtilizadas})=>{
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
    const corPadrao = (eDespesa ? "#AA0000" :'#009900');
    const corFonte  = (eDespesa ? 'white' :'black');

    const estilo= StyleSheet.create({
        rotulos:{
            fontSize: 12,
            color:corPadrao,
            marginLeft: 10
        },
        campos:{
            fontSize: 12,
            color:"black",
            textAlign:"center",
            borderColor:corPadrao,
            borderStyle:"solid",
            borderWidth:2,
            margin:10,
            padding: 2
        },
        campoCategoria:{
            flex: 2
        },
        pickerCategoria:{
            width: 99,
            padding: 0,
            margin:0,
        },
        botaoRegistrar:{
            backgroundColor:corPadrao,
            height:32,
            justifyContent:"center",
            alignItems:"center",
            margin:10
        },
        container:{
            flexDirection: "row",
            justifyContent: "space-around"            
        },
        pickerItems:{
            backgroundColor:corPadrao,
            color:"white",
            textAlign:"center"
        }
    });    
    
    const refCampoDinheiro = useRef();
    
    return(
        <View>
            
            <ContasPicker  
                        contas={contas} 
                        contaSelecionada={conta}
                        corFonte={corFonte}  
                        corPadrao={corPadrao}
                        onValueChange={c => setConta(c)}/>
            

            <Text style={estilo.rotulos}>Categoria</Text>
            <View style={estilo.container}>                            
                <TextInput  
                            style={[estilo.campos, estilo.campoCategoria]}
                            placeholderTextColor="gray"
                            value={categoria}
                            placeholder="Categoria"
                            onChangeText={setCategoria}
                            onSubmitEditing={()=>refCampoDinheiro.current.focus()}
                            />
                <Picker 
                    style={[estilo.pickerCategoria]}
                    onValueChange={setCategoria}
                    selectedValue="none"
                    dropdownIconColor="transparent"
                    >

                    <Picker.Item  
                                style={{display: "none",}}
                                label={"🔍"}
                                value="none"
                                />

                    {                        
                        categoriasJaUtilizadas.map((c,index) => (
                            <Picker.Item  
                                style={estilo.pickerItems}
                                label={c}
                                value={c}
                                key={index}
                                />
                        ))
                    }
                </Picker>
            </View>

            <Text style={estilo.rotulos}>Valor</Text>
            <CampoDinheiro
                        autoFocus={true}
                        estilo={estilo.campos}
                        valorInicial={valor}
                        aoMudarTexto={setValor}
                        negativo={eDespesa}
                        referencia={refCampoDinheiro}
                        />

            <Text style={estilo.rotulos}>Data</Text>
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
