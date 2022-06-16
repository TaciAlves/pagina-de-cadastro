// VALIDAÇÃO DO FORMULÁRIO

'use strict';

//IIFE -> Immediately Invoked Function Expression

(() => {
    const form = document.querySelector('[data-form]')
    const progressBar = document.querySelector('[data-requirement-progressbar]')
    const fields = {}
    const requirements = {}
    const state = {passwordStrength: 0}

    // função que exibe a mensagem de erro
    const showMessageError = (field, message) => {
        const { element, errorElement } = field
        element.classList.add('error')
        errorElement.style.display = 'block'
        errorElement.textContent = message
    }

    //função que esconde a mensagem de erro
    const hideMessageError = (field) => {
        const { element, errorElement } = field
        element.classList.remove('error')
        errorElement.style.display = 'none'
        errorElement.textContent = ''
    }

    // função que valida os campos obrigatórios do formulário
    const validateRequiredFields = () => {
        let isInvalid = false
        for (const fieldKey in fields) {
            const field = fields[fieldKey]
            const { element, errorElement, isRequired } = field
            if ((!element.value || (fieldKey === 'terms' && !element.checked)) && isRequired) {
                isInvalid = true
                showMessageError(field, 'Este campo é obrigatório')
            }
        }
        return isInvalid
    }

    const validatePasswordStrength = () => {
        let isInvalid = false 
        const field = fields['password']
        if(state.passwordStrength < 100){
            isInvalid = true
            showMessageError(field, 'Digite uma senha válida')
        }
        return isInvalid
    }

    const validateEmail = () => {
        let isInvalid = false
        const field = fields['email']
        const {value} = field.element
        if(!value.match(/^[a-zA-Z0-9_\.]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/)) { // validação de email
            isInvalid = true
            showMessageError(field, 'Digite um e-mail válido')
        }
        return isInvalid
    }

    const onInputPasswordKeyup = (event) => {
        const {value} = event.target
        // regular expression ou RegExp (serve pra validar alguns caracteres que tem dentro da senha)
        const lowerCasePattern = new RegExp(/[a-z]/) // pelo menos uma letra minuscula 
        const upperCasePattern = new RegExp(/[A-Z]/) // pelo menos uma letra maiuscula
        const numberPattern = new RegExp(/[0-9]/) // pelo menos uma letra maiuscula
        const specialCharacterPattern = new RegExp(/[!@#$%&*^~\^[\]{}?\.(-)+=_*]/) // pelo menos um caracter especial
        
        state.passwordStrength = 0

        if(value.match(lowerCasePattern) && value.match(upperCasePattern)) {
            state.passwordStrength += 25
            requirements['lowerUpperCase'].classList.add('checked')
        } else {
            requirements['lowerUpperCase'].classList.remove('checked')
        }

        if(value.match(numberPattern)){
            state.passwordStrength += 25
            requirements['number'].classList.add('checked')
        } else {
            requirements['number'].classList.remove('checked')
        }

        if(value.match(specialCharacterPattern)){
            state.passwordStrength += 25
            requirements['specialCharacter'].classList.add('checked')
        } else {
            requirements['specialCharacter'].classList.remove('checked')
        }

        if(value.length >= 8){
            state.passwordStrength += 25
            requirements['minCharacter'].classList.add('checked')
        } else {
            requirements['minCharacter'].classList.remove('checked')
        }

        progressBar.style.width = `${state.passwordStrength}%`
        progressBar.dataset.percentage = state.passwordStrength
    }

    const onInputFocus = (event) => {
        hideMessageError(fields[event.target.name])
    }

    const onFormSubmit = (event) => {
        event.preventDefault() //retira o alerta do proprio navegador
        if (validateRequiredFields()) return
        if (validateEmail()) return
        if (validatePasswordStrength()) return
        alert('Cadastro feito com sucesso.')
    }

    const setListeners = () => {
        form.addEventListener('submit', onFormSubmit)
        for (const fieldKey in fields) {
            const { element } = fields[fieldKey]
            element.addEventListener('focus', onInputFocus)
            if (fieldKey === 'password') element.addEventListener('keyup', onInputPasswordKeyup)
        }
    }

    const setRequirementItemsElements = () => {
        const requirementItemsElements = document.querySelectorAll('[data-requirement-item]')
        for (const requirementItem of requirementItemsElements){
            const requirementName = requirementItem.dataset['requirementItem']
            requirements[requirementName] = requirementItem
        }
    }

    const setFieldElements = () => {
        const inputElements = document.querySelectorAll('[data-input]')
        for (const input of inputElements) {
            const inputName = input.getAttribute('name')
            fields[inputName] = {
                element: input,
                errorElement: input.parentElement.querySelector('[data-error-message]'),
                isRequired: input.hasAttribute('required')
            }
            input.removeAttribute('required')
        }
    }

    const init = () => {
        setFieldElements()
        setRequirementItemsElements()
        setListeners()
    }

    init()
})()