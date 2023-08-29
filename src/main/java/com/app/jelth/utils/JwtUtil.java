package com.app.jelth.utils;

import com.app.jelth.domain.model.JelthUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

public class JwtUtil {



    public static String getUserId(String token,String secretKey){
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().get("uId",String.class);
    }
    public static String getUserCode(String token,String secretKey){
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().get("userCode",String.class);
    }
    public static boolean isExpired(String token, String secretKey){
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getExpiration().before(new Date());
    }

    public static String createJwt(JelthUser jelthUser, String secretKey, Long exporedMs){
        //토큰에 저장할 데이터를 입력
        Claims claims = Jwts.claims();
        claims.put("uId", jelthUser.getUId());
        claims.put("userCode",jelthUser.getUserCode());


        return Jwts.builder()
                .setClaims(claims) //토큰에 저장될 데이터 추가
                .setIssuedAt(new Date(System.currentTimeMillis())) //생산 시간
                .setExpiration(new Date(System.currentTimeMillis() + exporedMs)) // 만료 시간
                .signWith(SignatureAlgorithm.HS256,secretKey) //토큰에 보안 알고리즘 선택, secretKey 선택
                .compact();
    }
}
