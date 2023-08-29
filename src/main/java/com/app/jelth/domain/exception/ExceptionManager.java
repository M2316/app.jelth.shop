package com.app.jelth.domain.exception;


import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.ModelAndView;


@RestControllerAdvice
public class ExceptionManager {

    @ExceptionHandler(RuntimeException.class)
    public ModelAndView runtimeExceptionHandler(RuntimeException e){

        ModelAndView modelAndView = new ModelAndView("redirect:/login");
        modelAndView.addObject("msg",e.getMessage());

        return modelAndView;
    }

}
