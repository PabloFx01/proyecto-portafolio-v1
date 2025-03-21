package SpringBootRestctrlPagos.controllers.metales;


import SpringBootRestctrlPagos.Auth.AuthResponse;
import SpringBootRestctrlPagos.Auth.AuthService;
import SpringBootRestctrlPagos.Auth.LoginRequest;
import SpringBootRestctrlPagos.Auth.RegisterRequest;
import SpringBootRestctrlPagos.controllers.dto.UserDTO;
import SpringBootRestctrlPagos.controllers.dto.metales.PersonDTO;
import SpringBootRestctrlPagos.controllers.response.Response;
import SpringBootRestctrlPagos.models.ListadoPaginador;
import SpringBootRestctrlPagos.models.auth.ChangePassUser;
import SpringBootRestctrlPagos.models.entities.Usuario;
import SpringBootRestctrlPagos.models.entities.metales.Person;
import SpringBootRestctrlPagos.services.IUserService;
import SpringBootRestctrlPagos.services.metales.IPersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("tools/ctrlPagos/metalesApp/persona")
public class PersonController {
    @Autowired
    private IPersonService personService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<Person> personOptional = personService.findById(id);
        if (personOptional.isPresent()) {
            Person person = personOptional.get();
            PersonDTO personDTO = personToPersonDTO(person);
            return ResponseEntity.ok(personDTO);
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/findMaxId")
    public ResponseEntity<?> findMaxId() {
        Long maxId = personService.findMaxId();
        if (maxId != null) {
            return ResponseEntity.ok(maxId);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAll")
    public ResponseEntity<?> findAll() {
        List<PersonDTO> personList = personService.findAll()
                .stream()
                .map(person -> personToPersonDTO(person))
                .toList();

        return ResponseEntity.ok(personList);
    }

    @GetMapping("/findAllPaginado/{cantidad}/{pagina}")
    public ResponseEntity<?> findAllPagination(@PathVariable("cantidad") Long cantidad,
                                               @PathVariable("pagina") int pagina,
                                               @RequestParam(required = false) String filter) {
        ListadoPaginador<Person> listadoPaginador =
                personService.findAllWithPagination(cantidad, pagina, filter);

        return ResponseEntity.ok(listadoPaginador);
    }


    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody PersonDTO personDTO) throws URISyntaxException {
        Person person = personDTOToPerson(personDTO);
        person.setPassword(passwordEncoder.encode(personDTO.getPassword()));
        personService.saveOrUpdate(person);
        Response response = new Response();
        response.setIdMessage("201");
        response.setMessage("Registro creado con éxito.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) throws URISyntaxException {

        Optional<Person> optionalPerson = personService.findByAliasAndPassword(loginRequest.getUsername(), loginRequest.getPassword());

        if(optionalPerson.isPresent()){
            Response response = new Response();
            response.setIdMessage("202");
            response.setMessage("Acceso ok.");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

/*    @PostMapping("/changePass")
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

 */

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody PersonDTO personDTO) throws URISyntaxException {
        Optional<Person> optionalPerson = personService.findById(id);
        if (optionalPerson.isPresent()) {
            Person person = optionalPerson.get();


            person.setAlias(personDTO.getAlias());
            personService.saveOrUpdate(person);

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
            personService.deleteById(id);
            response.setIdMessage("200");
            response.setMessage("Registro eliminado");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }

    private PersonDTO personToPersonDTO(Person person) {
        return PersonDTO.builder()
                .id(person.getId())
                .nombre(person.getNombre())
                .alias(person.getAlias())
                .password(person.getPassword())
                .build();
    }

    private Person personDTOToPerson(PersonDTO personDTO) {
        return Person.builder()
                .id(personDTO.getId())
                .nombre(personDTO.getNombre())
                .alias(personDTO.getAlias())
                .password(personDTO.getPassword())
                .build();
    }

}
