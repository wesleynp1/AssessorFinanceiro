import React, { useState, useEffect } from "react";
import { View,TextInput,StyleSheet } from "react-native";




/**
 * 
 * @typedef {Object} props 
 * @property {number} valorInicial - Valor inicial em inteiro centavo de real
 * @property {(valor : number)=>{}} aoMudarTexto - Funçao de retorno em inteiro centavo de real
 * @property {boolean} negativo - defina True se quiser que este componete retorne o valor sempre negativo
 * @property {StyleSheet} estilo - Estilo deste componente
 * 
 * 
 * @param {props} props - Propriedades do Objeto
 */

const estiloPadrao = {
            fontSize: 12,
            color:"black",
            textAlign:"center",
            borderColor:"blue",
            borderStyle:"solid",
            borderWidth:2,
            margin:10,
            padding: 2
        };

const CampoDinheiro = ({valorInicial, //
                        aoMudarTexto, //ação ao usuário digitar                        
                        estilo=estiloPadrao,
                        borrarAoSubmeter=true, // se for o último campo {true} senão {false}
                        onSubmitEditing=()=>{}, //o que fazer quando o user dar submit(enter) no campo
                        referencia=()=>{},// executa uma ação com o ref se necessário
                        negativo=false 
                        })=>{

    const [valor,setValor] = useState(inteiroParaReal(valorInicial));
    
    //Caso "negativo" mude
    useEffect(()=>{
        if((valor.includes("-") && !negativo) || (valor.includes("+") &&  negativo)){
            aoMudarTextoOuNegativo(valor);
        };
    })        

    function aoMudarTextoOuNegativo(t){        
        let numero = (Math.abs(TextoParaInteiro(t))) * (negativo ? (-1) : 1);
        setValor(inteiroParaReal(numero)); // o que usuário vai ver
        aoMudarTexto(numero) // o que o aplicativo vai ver
    }    

    return(
        <View>
            <TextInput  style={estilo} 
                        value={valor}
                        placeholderTextColor="gray"
                        placeholder="Digite quanto ele custa..."
                        keyboardType="number-pad"
                        onChangeText={aoMudarTextoOuNegativo}
                        blurOnSubmit={borrarAoSubmeter}
                        onSubmitEditing={onSubmitEditing}
                        ref={referencia}
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

    let rs = (numero==0 ? "R$  " : (numero>0 ? "R$ +" : "R$ -"));

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