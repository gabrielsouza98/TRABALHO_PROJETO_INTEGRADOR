// Função para carregar o estoque do LocalStorage
function carregarEstoque() {
    let estoque = localStorage.getItem('estoque');
    return estoque ? JSON.parse(estoque) : [];
}

// Função para salvar o estoque no LocalStorage
function salvarEstoque(estoque) {
    localStorage.setItem('estoque', JSON.stringify(estoque));
}

// Função para adicionar um produto ao estoque
function adicionarProduto() {
    let nome = document.getElementById('nomeProduto').value;
    let quantidade = parseInt(document.getElementById('quantidadeProduto').value);
    let preco = parseFloat(document.getElementById('precoProduto').value);
    
    if (nome && quantidade && preco && quantidade > 0 && preco > 0) {
        let estoque = carregarEstoque();
        
        // Verificar se o produto já existe
        let produtoExistente = estoque.find(produto => produto.nome === nome);
        if (produtoExistente) {
            alert('Produto já existe no estoque.');
            return;
        }

        // Adicionar novo produto
        estoque.push({ nome, quantidade, preco });
        salvarEstoque(estoque);
        exibirEstoque();
        limparCampos();
        alert('Produto adicionado com sucesso!');
    } else {
        alert('Preencha todos os campos corretamente!');
    }
}

// Função para remover um produto do estoque
function removerProduto(nome) {
    let estoque = carregarEstoque();
    estoque = estoque.filter(produto => produto.nome !== nome);
    salvarEstoque(estoque);
    exibirEstoque();
}

// Função para exibir o estoque na tabela
function exibirEstoque() {
    let estoque = carregarEstoque();
    let tabela = document.getElementById('tabelaEstoque').getElementsByTagName('tbody')[0];
    tabela.innerHTML = ''; // Limpa a tabela antes de atualizar

    estoque.forEach(produto => {
        let linha = tabela.insertRow();
        let celulaNome = linha.insertCell(0);
        let celulaQuantidade = linha.insertCell(1);
        let celulaPreco = linha.insertCell(2);
        let celulaTotal = linha.insertCell(3);
        let celulaAcao = linha.insertCell(4);

        celulaNome.innerHTML = produto.nome;
        celulaQuantidade.innerHTML = produto.quantidade;
        celulaPreco.innerHTML = produto.preco.toFixed(2);
        celulaTotal.innerHTML = (produto.quantidade * produto.preco).toFixed(2);

        let botaoRemover = document.createElement('button');
        botaoRemover.innerHTML = 'Remover';
        botaoRemover.classList.add('btn-danger');
        botaoRemover.onclick = () => removerProduto(produto.nome);
        celulaAcao.appendChild(botaoRemover);
    });
}

// Função para limpar os campos do formulário
function limparCampos() {
    document.getElementById('nomeProduto').value = '';
    document.getElementById('quantidadeProduto').value = '';
    document.getElementById('precoProduto').value = '';
}

// Função para exportar o estoque para um arquivo Excel
function exportarParaExcel() {
    let estoque = carregarEstoque();
    if (estoque.length === 0) {
        alert("Nenhum produto no estoque para exportar.");
        return;
    }

    let wb = XLSX.utils.book_new();  // Cria um novo arquivo Excel
    let ws_data = [["Produto", "Quantidade", "Preço (R$)", "Total (R$)"]];

    estoque.forEach(produto => {
        ws_data.push([produto.nome, produto.quantidade, produto.preco.toFixed(2), (produto.quantidade * produto.preco).toFixed(2)]);
    });

    let ws = XLSX.utils.aoa_to_sheet(ws_data);  // Converte os dados para planilha
    XLSX.utils.book_append_sheet(wb, ws, "Estoque");  // Adiciona os dados à planilha
    XLSX.writeFile(wb, "estoque.xlsx");  // Exporta o arquivo Excel
}

// Carregar o estoque ao abrir a página
window.onload = exibirEstoque;
