Feature: Obtener estadisticas de matrices

  Scenario Outline: ES001_Observar que el servicio responda correctamente al calcular estadisticas de Q y R
    Given se desea calcular estadisticas de matrices con <input-file>
    When envio la peticion al servicio
    Then la respuesta deberia ser <output-file>

    Examples:
      | input-file               | output-file                          |
      | valid-matrices           | valid-matrices-response              |
      | missing-r-matrix         | missing-r-matrix-response            |
      | string-numeric-matrices  | string-numeric-matrices-response     |
