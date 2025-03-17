package SpringBootRestctrlPagos.controllers;


import SpringBootRestctrlPagos.Auth.AuthResponse;
import SpringBootRestctrlPagos.Auth.AuthService;
import SpringBootRestctrlPagos.Auth.LoginRequest;
import SpringBootRestctrlPagos.Auth.RegisterRequest;
import SpringBootRestctrlPagos.controllers.dto.UserDTO;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.auth.ChangePassUser;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/user")
@CrossOrigin(origins = {"http://localhost:4200"})
public class UserController {
    @Autowired
    private IUserService userService;
    @Autowired
    private AuthService authService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<Usuario> userOptional = userService.findById(id);
        if (userOptional.isPresent()) {
            Usuario user = userOptional.get();
            UserDTO userDTO = userToUserDTO(user);
            return ResponseEntity.ok(userDTO);
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/findMaxId")
    public ResponseEntity<?> findMaxId() {
        Long maxId = userService.findMaxId();
        if (maxId != null) {
            return ResponseEntity.ok(maxId);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAll")
    public ResponseEntity<?> findAll() {
        List<UserDTO> userList = userService.findAll()
                .stream()
                .map(user -> userToUserDTO(user))
                .toList();

        return ResponseEntity.ok(userList);
    }

    @GetMapping("/findAllPaginado/{cantidad}/{pagina}")
    public ResponseEntity<?> findAllPagination(@PathVariable("cantidad") Long cantidad,
                                               @PathVariable("pagina") int pagina,
                                               @RequestParam(required = false) String filter) {
        ListadoPaginador<Usuario> listadoPaginador =
                userService.findAllWithPagination(cantidad, pagina, filter);

        return ResponseEntity.ok(listadoPaginador);
    }


    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody UserDTO userDTO) throws URISyntaxException {
        authService.register(RegisterRequest.builder().
                username(userDTO.getUsername())
                .password(userDTO.getPassword())
                .role(userDTO.getRole())
                .build());
        Response response = new Response();
        response.setIdMessage("201");
        response.setMessage("Registro creado con éxito.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/changePass")
    public ResponseEntity<?> changePass(@RequestBody ChangePassUser changePassUser) throws URISyntaxException {
        try {
            AuthResponse authResponse =
                    (authService.login(LoginRequest.builder()
                            .username(changePassUser.getUsername())
                            .password(changePassUser.getOldPassword())
                            .build()));
        } catch (Exception e) {
            return ResponseEntity.ok(Response.builder()
                    .idMessage("501")
                    .message("Contraseña incorrecta")
                    .build());
        }
        Optional<Usuario> optionalUser = userService.findByUsername(changePassUser.getUsername());
        if(optionalUser.isPresent()){
            Usuario user = optionalUser.get();
            user.setPassword(passwordEncoder.encode(changePassUser.getNewPassword()));
            userService.saveOrUpdate(user);
        }
        Response response = new Response();
        response.setIdMessage("202");
        response.setMessage("Registro actualizado con éxito.");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody UserDTO userDTO) throws URISyntaxException {
        Optional<Usuario> optionalUser = userService.findById(id);
        if (optionalUser.isPresent()) {
            System.out.println("encontro usuario");
            Usuario user = optionalUser.get();

            user.setId(userDTO.getId());
            user.setUsername(userDTO.getUsername());
            user.setRole(userDTO.getRole());
            userService.saveOrUpdate(user);

            Response response = new Response();
            response.setIdMessage("202");
            response.setMessage("Registro modificado con éxito.");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Response response = new Response();
        if (id != null) {
            userService.deleteById(id);
            response.setIdMessage("200");
            response.setMessage("Registro eliminado");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }

    private UserDTO userToUserDTO(Usuario user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .password(user.getPassword())
                .role(user.getRole())
                .build();
    }

    private Usuario userDTOToUser(UserDTO userDTO) {
        return Usuario.builder()
                .id(userDTO.getId())
                .username(userDTO.getUsername())
                .password(userDTO.getPassword())
                .role(userDTO.getRole())
                .build();
    }

}
