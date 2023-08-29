package com.app.jelth.filter;

import com.app.jelth.domain.exception.JwtException;
import com.app.jelth.domain.service.login.UserService;
import com.app.jelth.utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.lang.model.type.ErrorType;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.jar.JarException;

@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final UserService userService;
    private final String secretKey;

    public JwtFilter(UserService userService,String secretKey ){
        this.userService = userService;
        this.secretKey = secretKey;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request
            , HttpServletResponse response
            , FilterChain filterChain
    ) throws ServletException, IOException {


        String authorization = "";

        if(request.getCookies() != null){
            for (Cookie cookie : request.getCookies()) {
                if("loginToken".equals(cookie.getName())){
                    authorization = cookie.getValue();
                    break;
                }
            }
        }

        if(authorization == null || !authorization.startsWith("Bearer/")){
//            throw new JarException(ErrorType.)
            filterChain.doFilter(request,response);
            return;
        }

        //토큰 꺼내기
        String token = authorization.split("/")[1];

        // Token Expired 체크
        if(JwtUtil.isExpired(token,secretKey)){
            log.info("Token이 만료 되었습니다.");
            filterChain.doFilter(request,response);
            return;
        }



        String uId = JwtUtil.getUserId(token,secretKey);
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(uId,null,Arrays.asList(new SimpleGrantedAuthority("USER")));
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        filterChain.doFilter(request,response);




        if(     //css, js, png, jpg 가 아닐때만 log 찍기
                !request.getRequestURI().endsWith(".css") &&
                        !request.getRequestURI().endsWith(".js") &&
                        !request.getRequestURI().endsWith(".png") &&
                        !request.getRequestURI().endsWith(".jpg")){
            log.info("user Request URI : {} || USER ID : {}",request.getRequestURI(),uId);
        }
    }
}
