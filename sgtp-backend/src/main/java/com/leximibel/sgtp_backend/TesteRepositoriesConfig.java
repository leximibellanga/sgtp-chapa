//package com.leximibel.sgtp_backend;
//
//import com.leximibel.sgtp_backend.model.enums.Role;
//import com.leximibel.sgtp_backend.repository.CarroRepository;
//import com.leximibel.sgtp_backend.repository.GastoRepository;
//import com.leximibel.sgtp_backend.repository.RegistoDiarioRepository;
//import com.leximibel.sgtp_backend.repository.UsuarioRepository;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import java.time.LocalDate;
//
//@Configuration
//public class TesteRepositoriesConfig {
//
//    @Bean
//    CommandLineRunner testarRepositories(
//            UsuarioRepository usuarioRepository,
//            CarroRepository carroRepository,
//            RegistoDiarioRepository registoDiarioRepository,
//            GastoRepository gastoRepository
//    ) {
//        return args -> {
//            System.out.println("===== TESTE DE REPOSITORIES =====");
//
//            System.out.println("findByEmail: " +
//                    usuarioRepository.findByEmail("admin@chapa.com"));
//
//            System.out.println("findByRole(MOTORISTA): " +
//                    usuarioRepository.findByRole(Role.MOTORISTA).size() + " encontrados");
//
//            System.out.println("findByAtivoTrue (usuarios): " +
//                    usuarioRepository.findByAtivoTrue().size() + " encontrados");
//
//            System.out.println("findByMatricula: " +
//                    carroRepository.findByMatricula("AAB-123-MC"));
//
//            System.out.println("findByAtivoTrue (carros): " +
//                    carroRepository.findByAtivoTrue().size() + " encontrados");
//
//            System.out.println("findByUsuarioIdAndData: " +
//                    registoDiarioRepository.findByUsuarioIdAndData(2L, LocalDate.of(2026, 7, 18)));
//
//            System.out.println("findByCarroId (gastos): " +
//                    gastoRepository.findByCarroId(1L).size() + " encontrados");
//
//            System.out.println("===== FIM DO TESTE =====");
//        };
//    }
//}
