-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 09-Abr-2021 às 23:49
-- Versão do servidor: 5.7.24
-- versão do PHP: 7.2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pastelaria`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `produtos`
--

DROP TABLE IF EXISTS `produtos`;
CREATE TABLE IF NOT EXISTS `produtos` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `NOME` varchar(80) NOT NULL,
  `TIPO` varchar(80) NOT NULL,
  `QUANTIDADE` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `servicos`
--

DROP TABLE IF EXISTS `servicos`;
CREATE TABLE IF NOT EXISTS `servicos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `descricao` varchar(500) NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `user_info`
--

DROP TABLE IF EXISTS `user_info`;
CREATE TABLE IF NOT EXISTS `user_info` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(200) NOT NULL,
  `tel` varchar(16) NOT NULL,
  `cel` varchar(16) NOT NULL,
  `email` varchar(120) NOT NULL,
  `cidade` varchar(80) NOT NULL,
  `bairro` varchar(80) NOT NULL,
  `rua` varchar(200) NOT NULL,
  `numero` smallint(6) NOT NULL,
  `complemento` varchar(120) NOT NULL,
  `login` varchar(50) NOT NULL,
  `senha` varchar(50) NOT NULL,
  `tipo` varchar(15) NOT NULL,
  `foto` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `user_info`
--

INSERT INTO `user_info` (`id_user`, `nome`, `tel`, `cel`, `email`, `cidade`, `bairro`, `rua`, `numero`, `complemento`, `login`, `senha`, `tipo`, `foto`) VALUES
(1, 'admin', '(99) 9 9999-9999', '(99) 9 9999-9999', 'opotunidades@smn.com.br', 'CIDADE ADMIN', 'administrador', 'Admin de admin', 999, '-', 'opotunidades@smn.com.br', 'teste123', 'ADM', 'images/profile/perfil.jpg');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
