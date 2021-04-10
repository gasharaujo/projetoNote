var express = require('express');
const db = require('../util/db');
var router = express.Router();
var session = require('express-session');
const app = express();
const multer = require('multer');
const { pathToFileURL } = require('url');
const path = require('path');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

app.use(express.static('public'));
//imagens
const storage = multer.diskStorage({
	destination: './public/images/profile/',
	filename: (req, file, cb) =>{
		// cb(erro, nome_arquivo + extensão do arquivo);
		cb(null, "Usuario" + Date.now() + path.extname(file.originalname));
	}
});
const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		checkFileType(file, cb)
	}
}).single('foto');
function checkFileType(file, cb){
	const filetypes = /jpeg|jgp|png/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);
	if(mimetype && extname){
		return cb(null, true);
	}else{
		cb('erro: apenas imagens');
	}
}
// Sessão
router.use(session({
	genid: function(req) {
		return require('crypto').randomBytes(48).toString('hex'); // use UUIDs for session IDs
	},
	secret: 's3CreT4pp'
}));
/* Rotas. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Tela de Login' });
});
router.post('/editarUser/:id', multipartMiddleware, function(req, res) {
	let id = req.params.id;
	let nome = req.body.nome;
	let telefone = req.body.telefone;
	let celular = req.body.celular;
	let email = req.body.email;
	let cidade = req.body.cidade;
	let bairro = req.body.bairro;
	let rua = req.body.rua;
	let numero = req.body.numero;
	let complemento = req.body.complemento;
	let login = req.body.login;
	let senha = req.body.senha;
	let tipo = req.body.tipo;
	db.query('UPDATE `user_info` SET `nome`=?, `tel`=?, `cel`=?, `email`=?, `cidade`=?, `bairro`=?, `rua`=?, `numero`=?, `complemento`=?, `senha`=?, `tipo`=? WHERE `id_user` = ?', [nome, telefone, celular, email, cidade, bairro, rua, numero, complemento, senha, tipo, id], (erro) =>{
		if(erro){
			res.render('error', {mensagem: erro});
		}else{
			res.redirect('/index');
		}
	});
});
router.post('/registarUser', upload, function(req, res) {
	let errosM = '';
	let validar = true;
	let rotaImagem = '';
	console.log('cheguei');
	console.log(req.body);
	let nome = req.body.nome;
	let telefone = req.body.telefone;
	let celular = req.body.celular;
	let email = req.body.email;
	let cidade = req.body.cidade;
	let bairro = req.body.bairro;
	let rua = req.body.rua;
	let numero = req.body.numero;
	let complemento = req.body.complemento;
	let login = req.body.login;
	let senha = req.body.senha;
	let tipo = req.body.tipo;

	// verifica existencia
	db.query('SELECT `tipo` FROM USER_INFO WHERE `login` like ?', [login], (erro, listagem) => {
		
		if(erro){
			errosM = erro;
			console.log(errosM);
			res.render('error', {message:erroM});
		}
		console.log('checkpoint 2');
		for(lista of listagem){
			validar = false;
		}
		console.log('validar: ' + validar);
		if(validar){
			// imagem
			upload(req, res, (erro) => {
				if(erro){
					errosM = erro;
					console.log(`erro single : ${errosM}`);
					res.render('error upload', {message:erroM});
				}else{
					if(req.file == 'undefined'){
						errosM = 'Foto não selecionada';
						console.log(errosM);
						res.render('error', {message:erroM});
					}else{
						rotaImagem = `images/profile/${req.file.filename}`;
					}
				}
				console.log('checkpoint 5');
			
				db.query("INSERT INTO `user_info`(`nome`, `tel`, `cel`, `email`, `cidade`, `bairro`, `rua`, `numero`, `complemento`, `login`, `senha`, `tipo`, `foto`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", [nome, telefone, celular, email, cidade, bairro, rua, numero, complemento, login, senha, tipo, rotaImagem], (erro, listagem) => {
					console.log('checkpoint 8');
					if(erro){
						errosM = erro;
						console.log(errosM);
						res.render('error', {message:erroM});
					}else{
						console.log('checkpoint 9');
						res.redirect('/index');
					}
				});
			});
		}else{
			if(!validar){
				console.log('checkpoint 10.1');
				res.render('error', { message: 'Usuario já registrado' });
			}else{
				console.log('checkpoint 10');
				res.render('error', {message: 'Dados Invalidos'});
			}
		}
		console.log('checkpoint 10');
	});
	// file: `images/profile/${req.file.filename}`;					
});
router.get('/index', function(req, res, next){
	if(req.session.TIPO){
		if(req.session.TIPO == 'ADM'){
			db.query('SELECT `id_user`,`login`,`tipo`, `foto` FROM `user_info`', [], function(erro, listagem){
				if(erro){
					console.log(lista);
					res.status(200).send(erro);
				}
					res.render('indexADM', {lista : listagem});
			});
		}else if(req.session.TIPO == 'subordinado'){
			db.query('SELECT s.*, ui.foto, (ui.nome) as perfil FROM `servicos` s LEFT JOIN `user_info` ui ON s.id_user = ui.id_user WHERE s.`id_user` = ?',[req.session.ID], (erro, listagem) => {
				if(erro){
					res.render('error', {message: erro});
				}else{
					res.render('listaTarefas', {lista: listagem});
				}
			});
		}else{
			res.redirect('/');
		}
	}
});
router.get('/registrar', (req, res, next) => {
	res.render('registro', {action : '/registarUser'});
});
router.post('/logged', function(req, res, next){
	db.query('SELECT TIPO, (`id_user`) as ID FROM USER_INFO WHERE LOGIN = ? AND SENHA = ?', [req.body.login, req.body.senha], function(erro, listagem){
		if(erro){
			console.log(lista);
			res.status(200).send(erro);
		}
		let rota = '/';
		for(lista of listagem){
			req.session.TIPO = lista.TIPO;
			req.session.ID = lista.ID;
			console.log('lista:'+ lista);
			rota = '/index';
		}
		res.redirect(rota);
	});
});
router.get('/editar/:id', (req, res, next) => {
	db.query('SELECT * FROM USER_INFO WHERE `id_user` = ?', [req.params.id], (erro, listagem) => {
		if(erro){
			res.render('registro', {message : erro});
		}
		res.render('registro', {action : '/editarUser/'+ req.params.id, lista: listagem[0]});

	});
});
router.get('/tarefas', (req, res) => {
	db.query('SELECT `id_user`, (`login`) as nome FROM user_info WHERE `tipo` like "subordinado"', [], (erro, listagem) => {
		if(erro){
			res.render('error', {message: erro});
		}
		res.render('formTarefas', {funcionarios: listagem});
	});
});
router.post('/regTarefas', (req, res) => {
	db.query('INSERT INTO `servicos`(`id_user`, `descricao`, `status`) VALUES (?, ?, "pendente")', [req.body.funcionario, req.body.tarefa], (erro) => {
		if(erro){
			res.render('error', {message: erro});
		}else{
			res.redirect('/tarefas');
		}
	});
});
router.get('/monitorar', (req, res) => {
	db.query('SELECT s.descricao, s.status, (ui.login) as nome FROM `servicos` s LEFT JOIN `user_info` ui ON s.id_user = ui.id_user', (erro, listagem) => {
		if(erro){
			res.render('error', {message: erro});
		}else{
			res.render('monitora', {lista: listagem});
		}
		

	});
});
router.get('/andamento/:id', (req, res, next) =>{
	db.query('UPDATE `servicos` SET `status`= "Em andamento" WHERE `id` = ?', [req.params.id], (erro)=>{
		if(erro){
			res.render('error', {message: erro});
		}else{
			res.redirect('/index');
		}
	});
});
router.get('/comcluido/:id', (req, res, next) =>{
	db.query('UPDATE `servicos` SET `status`= "concluido" WHERE `id` = ?', [req.params.id], (erro)=>{
		if(erro){
			res.render('error', {message: erro});
		}else{
			res.redirect('/index');
		}
	});
	
});

module.exports = router;