package dev.zemco.schemalens.modeling.diagrams

import dev.zemco.schemalens.modeling.models.DataModel
import dev.zemco.schemalens.validation.OnCreate
import dev.zemco.schemalens.validation.OnUpdate
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/model/{model}/diagram")
class DataModelDiagramController(
    private val diagramService: DataModelDiagramService,
) {

    @GetMapping
    fun getAllDiagrams(@PathVariable model: DataModel): List<DataModelDiagramSimpleDto> =
        diagramService.getAllDiagrams(model)

    @GetMapping("/{diagramId}")
    fun getDiagram(
        @PathVariable model: DataModel,
        @PathVariable diagramId: Long,
    ): DataModelDiagramDto = diagramService.getDiagram(model, diagramId)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createDiagram(
        @PathVariable model: DataModel,
        @RequestBody @Validated(OnCreate::class) dto: DataModelDiagramInputDto,
    ): DataModelDiagramDto = diagramService.createDiagram(model, dto)

    @PutMapping("/{diagramId}")
    fun updateDiagram(
        @PathVariable model: DataModel,
        @PathVariable diagramId: Long,
        @RequestBody @Validated(OnUpdate::class) dto: DataModelDiagramInputDto,
    ): DataModelDiagramDto = diagramService.updateDiagram(model, diagramId, dto)

    @DeleteMapping("/{diagramId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteDiagram(
        @PathVariable model: DataModel,
        @PathVariable diagramId: Long,
    ) {
        diagramService.deleteDiagram(model, diagramId)
    }
}
