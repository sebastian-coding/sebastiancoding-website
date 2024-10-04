---
title: '¿Test unitarios? No, gracias'
description: 'Aunque siempre se habla de test unitarios, estos realmente dan poca utilidad, en comparación a otros tipos de tests, como los tests E2E'
pubDate: 'Oct 04 2024'
heroImage: '/unit-testing.jpg'
category: 'decode-spot-es'
type: 'post'
---

En algún momento, tuve que alcanzar el absurdo del 90% de cobertura en los tests. ¿Pero adivinen qué? Eran todos
tests unitarios. Y adivinen de nuevo… ¡sí, todo explotó en producción de todas formas!

¡Prepárense! Es hora de hacer Decode.

## Por qué los Tests Unitarios son inútiles (comparados con otros tipos de tests)

1. Alcance limitado

   El test unitario se centra en probar componentes o funciones individuales de manera aislada. Esto a menudo significa
   simular dependencias, lo que da lugar a tests que no reflejan escenarios del mundo real. En contraste, los tests de
   integración, validan cómo funcionan juntos diferentes módulos, ofreciendo una cobertura más completa al probar
   interacciones reales.

   Los tests unitarios pueden pasar incluso, si la aplicación en su conjunto está rota debido a problemas entre
   componentes, bases de datos o APIs de terceros. Esta es una limitación crítica del test unitario: no captura la
   imagen completa.

2. Falsa sensación de seguridad

   Los desarrolladores pueden sentirse excesivamente confiados en su código si los tests unitarios pasan, aunque estos
   tests no verifiquen si todo el sistema funciona correctamente. Esta sensación de seguridad puede ser peligrosa cuando
   se descuidan los tests end-to-end (E2E), ya que este tipo de tests está diseñado para evaluar el sistema desde la
   perspectiva del usuario.

   Aunque los tests unitarios pueden asegurar que los componentes individuales se comporten como se espera de manera
   aislada, no logran validar los flujos reales de los usuarios, donde las interacciones entre diferentes capas del
   sistema (frontend, backend, bases de datos) son esenciales.

3. Alto costo de mantenimiento

   En muchos casos, los tests unitarios deben actualizarse cada vez que hay cambios en la implementación interna del
   código, incluso si el comportamiento externo no ha cambiado. Este alto costo de mantenimiento puede agotar recursos.
   Los tests end-to-end, por el contrario, se centran en el comportamiento desde el punto de vista del usuario y tienden
   a ser más resilientes a las refactorizaciones internas, reduciendo la frecuencia de actualizaciones necesarias en los
   tests.

   Los tests unitarios a menudo requieren que los desarrolladores escriban tests para cada pequeño cambio, lo que puede
   llevar a la fatiga y frustración cuando tienen que actualizar o corregir continuamente los tests tras una
   refactorización, incluso si desde la perspectiva del usuario no hay nada roto.

4. Descuido de casos de uso reales

   Los tests unitarios se enfocan en el "camino feliz" de los componentes individuales, a menudo ignorando los casos
   límite y los escenarios del mundo real. Como estos tests tienden a simular servicios externos (como APIs o bases de
   datos), no tienen en cuenta fallas de red, problemas de rendimiento o comportamientos inesperados de los usuarios.
   Los tests de integración y los tests E2E son más efectivos para simular condiciones del mundo real, asegurando que
   todo el sistema sea robusto bajo diferentes escenarios.

   Por ejemplo, un test E2E podría revelar que una secuencia de interacciones entre dos componentes falla bajo ciertas
   condiciones, aunque los tests unitarios de cada componente pasen individualmente.

5. Enfoque en la implementación, no en el comportamiento

   Los tests unitarios suelen probar la lógica interna, lo que puede llevar a que los tests estén demasiado atados a los
   detalles de la implementación. Esto resulta en tests frágiles que fallan durante la refactorización, aunque el
   comportamiento general de la aplicación siga siendo el mismo. En comparación, los tests orientados al
   comportamiento (como los realizados con herramientas como Cucumber) se centran en cómo se comporta el sistema desde
   la perspectiva del usuario. Estos tests de alto nivel aseguran que el sistema se comporte como se espera sin
   preocuparse de cómo está estructurado internamente el código.

   Esta diferencia en el enfoque significa que los tests unitarios pueden no capturar el valor real que el software
   proporciona a los usuarios finales, que es la principal preocupación de la mayoría de los proyectos de software.

## El caso con otros tipos de testing

Aunque los tests unitarios tienen su lugar, otras metodologías de testing pueden ofrecer más valor en muchos escenarios:

- Tests de Integración: Prueban cómo trabajan juntos los componentes. Estos tests aseguran que APIs, bases de datos y
  servicios de terceros interactúan como se espera. El test de integración brinda confianza en que las partes móviles
  del sistema funcionan en armonía.

- Tests End-to-End (E2E): Se centran en probar todo el sistema desde la perspectiva del usuario, de principio a
  fin. Estos tests simulan acciones reales de los usuarios, asegurando que todo el sistema se comporte correctamente en
  producción.

## Conclusión

El test unitario no es completamente inútil, pero comparado con otras metodologías de testing, puede quedarse corto al
capturar la verdadera esencia de cómo se comporta un sistema en condiciones del mundo real. Los tests de integración y
los tests E2E, ofrecen una visión más amplia y profunda de la salud de una aplicación, al probar escenarios reales que
los tests unitarios por sí solos no pueden abordar.

Al enfatizar otras formas de testing sobre los tests unitarios, los equipos pueden invertir su tiempo en tests de mayor
valor, que brinden garantías más sustanciales de que la aplicación está funcionando como se espera en el mundo real.

Eso es todo por hoy. Y Decode... terminado.