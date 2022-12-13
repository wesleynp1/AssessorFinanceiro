import React, { useState } from "react";
import { View,TextInput,StyleSheet } from "react-native";

const CampoDinheiro = ({valorInicial, //valor inicial em centavos inteiros
                        aoMudarTexto, //ação ao usuário digitar
                        borrarAoSubmeter, // se for o último campo {true} senão {false}
                        estilo,
                        aoTerminarDigitar=()=>{}, //o que fazer quando o user dar submit no campo
                        referencia=()=>{} // executa uma ação com o ref se necessário
                        })=>{

    const [valor,setValor] = useState(inteiroParaReal(valorInicial));

    return(
        <View>
            <TextInput  style={estilo} 
                        value={valor}
                        placeholderTextColor="gray"
                        placeholder="Digite quanto ele custa..."
                        keyboardType="number-pad"
                        onChangeText={t=>{
                            let numero = TextoParaInteiro(t);
                            setValor(inteiroParaReal(numero)); // o que usuário vai ver
                            aoMudarTexto(numero) // o que o aplicativo vai ver
                            }}
                        blurOnSubmit={borrarAoSubmeter}
                        onSubmitEditing={()=>{aoTerminarDigitar()}}
                        ref={r=>referencia(r)}
                            />                        
        </View>
    );
}

const filtrarCaracteres = (texto) =>{
    return  Array.from(texto)
        .filter(c =>"0123456789".includes(c))//caracteres permitidos
        .join("");
}

export const inteiroParaReal = (numero)=>{

    let n = Math.abs(numero);

    let rs = numero>=0 ? "R$ " : "R$ -";

    if(n<10) //1 algarismo
    {
        return rs + "0,0" + n.toString();
    }
    else
    if(n<100) //2 algarismos
    {
        return rs + "0," + n.toString();
    }
    else//3 ou mais algarismos
    {
        let caracteres = Array.from(n.toString())

        let centavos = caracteres.slice(-2).join('');// 2 últimos caracteres
        let reais = caracteres.slice(0,caracteres.length-2).join('');//tudo menos os 2 últimos caracteres
        
        return rs + reais + "," + centavos;
    }
}

const TextoParaInteiro = (texto)=>{
    let textoFiltrado = filtrarCaracteres(texto);

    if(textoFiltrado==""){
        return 0;
    }
    else{
        return parseInt(textoFiltrado);
    }       
}

export default CampoDinheiro;